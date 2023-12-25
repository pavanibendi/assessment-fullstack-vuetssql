import { sendEmail } from "@mono/emails";
import type { TemplateName, Language, emailData } from "@mono/emails";

export const sendEmailService = async (
  userEmail: string,
  templateName: TemplateName,
  locale: Language,
  data: emailData
) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.table({ data });
      return { success: true };
    }
    await sendEmail(userEmail, templateName, locale, data);
    return { success: true };
  } catch (error) {
    console.error("🚀 ~ email ~ error", error);
    return { success: false, error };
  }
};
