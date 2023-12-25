import { object, string } from "zod";
import type { z } from "zod";

// emailChangeRequest
export const emailChangeRequestSchema = object({
  email: string().email(),
  password: string().min(8),
});
export type EmailChangeRequestSchemaType = z.infer<
  typeof emailChangeRequestSchema
>;

// emailChangeVerify
export const emailChangeVerifySchema = object({
  otpCode: string().length(6).regex(/^\d+$/),
});
export type EmailChangeVerifySchemaType = z.infer<
  typeof emailChangeVerifySchema
>;

// passwordChange
export const passwordChangeSchema = object({
  password: string().min(8),
  newPassword: string().min(8),
});
export type PasswordChangeSchemaType = z.infer<typeof passwordChangeSchema>;
