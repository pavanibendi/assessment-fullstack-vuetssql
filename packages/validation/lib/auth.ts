import { object, string, boolean } from "zod";
import type { z } from "zod";

// login
export const loginSchema = object({
  email: string().email(),
  password: string().min(8),
  rememberMe: boolean(),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

// register
export const registerSchema = object({
  name: string().min(2),
  email: string().email(),
  password: string().min(8),
});
export type RegisterSchemaType = z.infer<typeof registerSchema>;

// emailVerifySubmit
export const emailVerifySubmitSchema = object({
  email: string().email(),
  otpCode: string()
    .length(6)
    .regex(/^[0-9]+$/),
});
export type EmailVerifySubmitSchemaType = z.infer<
  typeof emailVerifySubmitSchema
>;

// passwordResetRequest
export const passwordResetRequestSchema = object({
  email: string().email(),
});
export type PasswordResetRequestSchemaType = z.infer<
  typeof passwordResetRequestSchema
>;

// passwordResetSubmit
export const passwordResetSubmitSchema = object({
  email: string().email(),
  newPassword: string().min(8),
  token: string(),
});
export type PasswordResetSubmitSchemaType = z.infer<
  typeof passwordResetSubmitSchema
>;
