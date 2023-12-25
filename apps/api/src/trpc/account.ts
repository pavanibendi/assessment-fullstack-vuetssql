import * as bcryptjs from "bcryptjs";
import {
  passwordChangeSchema,
  emailChangeRequestSchema,
  emailChangeVerifySchema,
} from "@mono/validation/lib/account";
import { router, trpcError, protectedProcedure } from "../trpc";
import { sendEmailService } from "../notifications/email";
export const account = router({
  me: protectedProcedure.query(async ({ ctx: { prisma, user } }) => {
    const { userId } = user;
    console.debug("🚀 ~ me:protectedProcedure.query ~ userId", userId);
    const targetUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
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
    .mutation(async ({ ctx: { prisma, user }, input }) => {
      const { userId } = user;
      const { password, newPassword } = input;
      const targetUser = await prisma.users.findUnique({
        where: { id: userId },
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
      await prisma.users.update({
        where: { id: userId },
        data: {
          hashedPassword,
        },
      });
      return {
        success: true,
      };
    }),
  emailChangeRequest: protectedProcedure
    .input(emailChangeRequestSchema)
    .mutation(async ({ ctx: { prisma, user }, input }) => {
      const { userId } = user;
      const { email, password } = input;
      const emailNormalized = email.toLowerCase();
      const targetUser = await prisma.users.findUnique({
        where: { id: userId },
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
      await prisma.emailChangeRequests.create({
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
    .mutation(async ({ ctx: { prisma, user }, input }) => {
      const { userId } = user;
      const { otpCode } = input;
      const targetUser = await prisma.users.findUnique({
        where: { id: userId },
      });
      if (!targetUser) {
        throw new trpcError({
          code: "NOT_FOUND",
        });
      }
      const targetChangeRequest = await prisma.emailChangeRequests.findFirst({
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
      await prisma.users.update({
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
