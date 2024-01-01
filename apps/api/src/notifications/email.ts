// import { sendEmail } from "@mono/emails";
// import type { TemplateName, Language, emailData } from "@mono/emails";
const languages = ["en", "fr"] as const;
type Language = (typeof languages)[number];
type TemplateName = "register" | "passwordResetRequest" | "emailChangeOtp";
type emailData = {
  userName?: string;
  otpCode?: string;
  token?: string;
};
const sendEmail = (
  userEmail: string,
  templateName: TemplateName,
  locale: Language,
  data: emailData
) => {
  console.table(data);
  console.table({ userEmail, templateName, locale });
};
export const sendEmailService = async (
  userEmail: string,
  templateName: TemplateName,
  locale: Language,
  data: emailData
) => {
  try {
    await sendEmail(userEmail, templateName, locale, data);
    return { success: true };
  } catch (error) {
    console.error("🚀 ~ email ~ error", error);
    return { success: false, error };
  }
};
