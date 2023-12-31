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
import { db, schema } from "../db";
import { isNull, eq, isNotNull, gte, sql, and, desc } from "drizzle-orm";

const salt = 10;
const jwtSecret = process.env.JWT_SECRET as string;

export type MyJwtPayload = {
  userId: string;
};
export const auth = router({
  refresh: publicProcedure.mutation(async ({ ctx: { req, res } }) => {
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
    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, payload.userId),
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
    .mutation(async ({ input, ctx: { res } }) => {
      const { email, password } = input;
      const emailNormalized = email.toLowerCase();
      const user = await db.query.user.findFirst({
        where: and(
          eq(schema.user.email, emailNormalized),
          isNotNull(schema.user.emailVerified)
        ),
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
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const emailNormalized = email.toLowerCase();
      const user = await db.query.user.findFirst({
        where: eq(schema.user.email, emailNormalized),
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
      const [createdUser] = await db
        .insert(schema.user)
        .values({
          name,
          email: emailNormalized,
          hashedPassword,
        })
        .returning();
      // create random otpCode
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      // create verify request
      const [verifyRequest] = await db
        .insert(schema.emailVerification)
        .values({
          userId: createdUser.id,
          email: emailNormalized,
          otpCode,
        })
        .returning();
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
    .mutation(async ({ input }) => {
      const { email, otpCode } = input;
      const emailNormalized = email.toLowerCase();
      // get requests for this email within the last 10 minutes
      const timeBefore10Minutes = new Date(Date.now() - 10 * 60 * 1000);
      const verifyRequest = await db.query.emailVerification.findFirst({
        where: and(
          eq(schema.emailVerification.email, emailNormalized),
          gte(schema.emailVerification.createdAt, timeBefore10Minutes)
        ),
        orderBy: desc(schema.emailVerification.createdAt),
      });
      // check 400
      if (!verifyRequest || verifyRequest.attempts >= 5) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      // if valid, update user to verified
      if (verifyRequest.otpCode === otpCode) {
        await db
          .update(schema.user)
          .set({
            emailVerified: new Date(),
          })
          .where(eq(schema.user.id, verifyRequest.userId));
        return {
          success: true,
        };
      }
      // if invalid, increment attempts
      await db.execute(
        sql`UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ${verifyRequest.id}`
      );
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
    .mutation(async ({ input }) => {
      const { email } = input;
      const emailNormalized = email.toLowerCase();
      // get user
      const user = await db.query.user.findFirst({
        where: and(
          eq(schema.user.email, emailNormalized),
          isNull(schema.user.emailVerified)
        ),
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
      const [verifyRequest] = await db
        .insert(schema.emailVerification)
        .values({
          userId: user.id,
          email: emailNormalized,
          otpCode,
        })
        .returning();
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
    .mutation(async ({ input }) => {
      const { email } = input;
      const emailNormalized = email.toLowerCase();
      // get user
      const user = await db.query.user.findFirst({
        where: and(
          eq(schema.user.email, emailNormalized),
          isNotNull(schema.user.emailVerified)
        ),
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
      const [resetRequest] = await db
        .insert(schema.passwordResetRequest)
        .values({
          userId: user.id,
          token,
        })
        .returning();
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
    .mutation(async ({ input }) => {
      const { email, token, newPassword } = input;
      // get user
      const normalizedEmail = email.toLowerCase();
      const user = await db.query.user.findFirst({
        where: and(
          eq(schema.user.email, normalizedEmail),
          isNotNull(schema.user.emailVerified)
        ),
      });
      // check 404
      if (!user) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      // get request
      const resetRequest = await db.query.passwordResetRequest.findFirst({
        where: and(
          eq(schema.passwordResetRequest.token, token),
          eq(schema.passwordResetRequest.userId, user.id)
        ),
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
      await db
        .update(schema.user)
        .set({
          hashedPassword,
        })
        .where(eq(schema.user.id, user.id));
      // return
      return {
        success: true,
      };
    }),
});
