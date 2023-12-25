import * as bcryptjs from "bcryptjs";
import {
  passwordChangeSchema,
  emailChangeRequestSchema,
  emailChangeVerifySchema,
} from "@mono/validation/lib/account";
import { router, trpcError, protectedProcedure } from "../trpc";
import { sendEmailService } from "../notifications/email";
import { eq } from "drizzle-orm";

export const account = router({
  me: protectedProcedure.query(async ({ ctx: { db, user } }) => {
    const { userId } = user;
    const targetUser = await db.query.user.findFirst({
      where: (user) => eq(user.id, userId),
      columns: {
        name: true,
        email: true,
      },
    });
    if (!targetUser) {
      throw new trpcError({
        code: "NOT_FOUND",
      });
    }
    return {
      ...targetUser,
    };
  }),
  passwordChange: protectedProcedure
    .input(passwordChangeSchema)
    .mutation(async ({ ctx: { db, user, dbSchema }, input }) => {
      const { userId } = user;
      const { password, newPassword } = input;
      const targetUser = await db.query.user.findFirst({
        where: (user) => eq(user.id, userId),
      });
      if (!targetUser) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      const isPasswordCorrect = await bcryptjs.compare(
        password,
        targetUser.hashedPassword
      );
      if (!isPasswordCorrect) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      await db
        .update(dbSchema.user)
        .set({
          hashedPassword,
        })
        .where(eq(dbSchema.user, userId));

      return {
        success: true,
      };
    }),
  emailChangeRequest: protectedProcedure
    .input(emailChangeRequestSchema)
    .mutation(async ({ ctx: { db, user }, input }) => {
      const { userId } = user;
      const { email, password } = input;
      const emailNormalized = email.toLowerCase();
      const targetUser = await db.query.user.findFirst({
        where: (user) => eq(user.id, userId),
      });
      if (!targetUser) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      const isPasswordCorrect = await bcryptjs.compare(
        password,
        targetUser.hashedPassword
      );
      if (!isPasswordCorrect) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      // create random otp code
      const otpCode = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      // create change request record
      await db.query.emailChangeRequests.create({
        data: {
          userId,
          otpCode,
          newEmail: emailNormalized,
        },
      });
      // notify user
      await sendEmailService(emailNormalized, "emailChangeOtp", "en", {
        userName: targetUser.name,
        otpCode,
      });
      return {
        success: true,
      };
    }),
  emailChangeVerify: protectedProcedure
    .input(emailChangeVerifySchema)
    .mutation(async ({ ctx: { db, user }, input }) => {
      const { userId } = user;
      const { otpCode } = input;
      const targetUser = await db.users.findUnique({
        where: { id: userId },
      });
      if (!targetUser) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      const targetChangeRequest = await db.emailChangeRequests.findFirst({
        where: {
          userId,
          otpCode,
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 10),
          },
        },
      });
      if (!targetChangeRequest) {
        throw new trpcError({
          code: "BAD_REQUEST",
        });
      }
      // update user email
      await db.users.update({
        where: { id: userId },
        data: {
          email: targetChangeRequest.newEmail,
        },
      });
      // return
      return {
        success: true,
      };
    }),
  logout: protectedProcedure.mutation(({ ctx: { res } }) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      path: "/",
    });
    res.clearCookie("refreshToken", { httpOnly: true, path: "/" });
    return {
      success: true,
    };
  }),
});
