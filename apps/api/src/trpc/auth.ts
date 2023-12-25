import * as jwt from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import * as crypto from "crypto";
import {
  loginSchema,
  registerSchema,
  emailVerifySubmitSchema,
  passwordResetRequestSchema,
  passwordResetSubmitSchema,
} from "@mono/validation/lib/auth";
import { router, trpcError, publicProcedure } from "../trpc";
import { sendEmailService } from "../notifications/email";
import { setCookie, getCookie, clearCookie } from "../functions/cookies";
import { z } from "zod";

const salt = 10;
const jwtSecret = process.env.JWT_SECRET as string;

export type MyJwtPayload = {
  userId: string;
};
export const auth = router({
  refresh: publicProcedure.mutation(async ({ ctx: { db, req, res } }) => {
    const refreshToken = getCookie({ req, name: "refreshToken" });
    if (!refreshToken) {
      throw new trpcError({
        code: "BAD_REQUEST",
      });
    }
    let payload: MyJwtPayload;
    try {
      payload = jwt.verify(refreshToken, jwtSecret) as MyJwtPayload;
    } catch (error) {
      clearCookie({
        res,
        name: "refreshToken",
      });
      throw new trpcError({
        code: "UNAUTHORIZED",
      });
    }
    const user = await db.users.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new trpcError({
        code: "BAD_REQUEST",
      });
    }
    const accessToken = await jwt.sign(payload, jwtSecret, {
      expiresIn: "1d",
    });
    const newRefreshToken = await jwt.sign(payload, jwtSecret, {
      expiresIn: "7d",
    });
    // assign tokens to cookies
    setCookie({
      res,
      name: "accessToken",
      value: accessToken,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    setCookie({
      res,
      name: "refreshToken",
      value: newRefreshToken,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    return {
      success: true,
    };
  }),
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx: { db, res } }) => {
      const { email, password } = input;
      const emailNormalized = email.toLowerCase();
      const user = await db.users.findFirst({
        where: { email: emailNormalized, emailVerified: true },
      });
      // check 404
      if (!user) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      // validate password
      const valid = await bcryptjs.compare(password, user.hashedPassword);
      if (!valid) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      // create tokens and return them
      const payload: MyJwtPayload = { userId: user.id };
      const accessToken = await jwt.sign(payload, jwtSecret, {
        expiresIn: "1d",
      });
      const refreshToken = await jwt.sign(payload, jwtSecret, {
        expiresIn: "7d",
      });
      // assign tokens to cookies
      setCookie({
        res,
        name: "accessToken",
        value: accessToken,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      setCookie({
        res,
        name: "refreshToken",
        value: refreshToken,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      return {
        success: true,
      };
    }),
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const { name, email, password } = input;
      const emailNormalized = email.toLowerCase();
      const user = await db.users.findUnique({
        where: { email: emailNormalized },
      });
      // check 400
      if (user) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      // hash password
      const hashedPassword = await bcryptjs.hash(password, salt);
      // create user
      const createdUser = await db.users.create({
        data: {
          name,
          email: emailNormalized,
          hashedPassword,
        },
      });
      // create random otpCode
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      // create verify request
      const verifyRequest = await db.emailVerifications.create({
        data: {
          userId: createdUser.id,
          email: emailNormalized,
          otpCode,
        },
      });
      // notify user
      sendEmailService(emailNormalized, "register", "en", {
        userName: name,
        otpCode: verifyRequest.otpCode,
      });
      return {
        success: true,
      };
    }),
  emailVerifySubmit: publicProcedure
    .input(emailVerifySubmitSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const { email, otpCode } = input;
      const emailNormalized = email.toLowerCase();
      // get requests for this email within the last 10 minutes
      const timeBefore10Minutes = new Date(Date.now() - 10 * 60 * 1000);
      const verifyRequest = await db.emailVerifications.findFirst({
        where: {
          email: emailNormalized,
          createdAt: {
            gte: timeBefore10Minutes,
          },
        },
        orderBy: { createdAt: "desc" },
      });
      // check 400
      if (!verifyRequest || verifyRequest.attempts >= 5) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      // if valid, update user to verified
      if (verifyRequest.otpCode === otpCode) {
        await db.users.update({
          where: { id: verifyRequest.userId },
          data: { emailVerified: true },
        });
        return {
          success: true,
        };
      }
      // if invalid, increment attempts
      await db.emailVerifications.update({
        where: { id: verifyRequest.id },
        data: { attempts: { increment: 1 } },
      });
      return {
        success: false,
      };
    }),
  emailVerifyRequest: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { email } = input;
      const emailNormalized = email.toLowerCase();
      // get user
      const user = await db.users.findFirst({
        where: { email: emailNormalized, emailVerified: false },
      });
      // check 404
      if (!user) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      // create random otpCode
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      // create verify request
      const verifyRequest = await db.emailVerifications.create({
        data: {
          userId: user.id,
          email: emailNormalized,
          otpCode,
        },
      });
      // notify user
      sendEmailService(emailNormalized, "register", "en", {
        userName: user.name,
        otpCode: verifyRequest.otpCode,
      });
      return {
        success: true,
      };
    }),
  passwordResetRequest: publicProcedure
    .input(passwordResetRequestSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const { email } = input;
      const emailNormalized = email.toLowerCase();
      // get user
      const user = await db.users.findFirst({
        where: { email: emailNormalized, emailVerified: true },
      });
      // check 404
      if (!user) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      // create random token
      const token = crypto.randomBytes(64).toString("hex");

      // create reset request
      const resetRequest = await db.passwordResetRequests.create({
        data: {
          userId: user.id,
          token,
        },
      });
      // notify user
      sendEmailService(emailNormalized, "passwordResetRequest", "en", {
        userName: user.name,
        token: resetRequest.token,
      });
      return {
        success: true,
      };
    }),
  passwordResetSubmit: publicProcedure
    .input(passwordResetSubmitSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      const { email, token, newPassword } = input;
      // get user
      const normalizedEmail = email.toLowerCase();
      const user = await db.users.findFirst({
        where: { email: normalizedEmail, emailVerified: true },
      });
      // check 404
      if (!user) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      // get request
      const resetRequest = await db.passwordResetRequests.findFirst({
        where: { userId: user.id, token },
      });
      // check 404
      if (!resetRequest) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      // hash password
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
      // update user
      await db.users.update({
        where: { id: user.id },
        data: { hashedPassword },
      });
      // return
      return {
        success: true,
      };
    }),
});
