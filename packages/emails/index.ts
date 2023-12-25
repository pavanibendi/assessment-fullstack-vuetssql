import * as Mustache from "mustache";
import * as path from "path";
import * as fs from "fs/promises";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const client = new SESClient({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const languages = ["en", "ar"] as const;
const templateTitles = {
  register: {
    en: "Register",
    ar: "تسجيل",
  },
  passwordResetRequest: {
    en: "Password Reset Request",
    ar: "إعادة تعيين كلمة المرور",
  },
  emailChangeOtp: {
    en: "You requested to change your email address",
    ar: "لقد طلبت تغيير عنوان بريدك الإلكتروني",
  },
} as const;

export type Language = (typeof languages)[number];
export type TemplateName = keyof typeof templateTitles;
export interface emailData {
  userName?: string;
  otpCode?: string;
  token?: string;
}

const templateBasePath = ["production", "staging"].includes(
  process.env.NODE_ENV as string
)
  ? "dist/emails"
  : ".dev/emails";

const buildTemplatePath = (templateName: TemplateName, locale: Language) =>
  path.join(__dirname, templateBasePath, `${templateName}.${locale}.html`);

const readTemplate = async (templateName: TemplateName, locale: Language) => {
  const templatePath = buildTemplatePath(templateName, locale);
  return await fs.readFile(templatePath, "utf-8");
};

export const sendEmail = async (
  userEmail: string,
  templateName: TemplateName,
  locale: Language,
  data: emailData
) => {
  console.debug("🚀 sendEmail ~ data", data);
  try {
    const template = await readTemplate(templateName, locale);
    const html = Mustache.render(template, { data });
    const subject = templateTitles[templateName][locale];
    const command = new SendEmailCommand({
      Source: "Support <support@example.com>",
      Destination: {
        ToAddresses: [userEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    });
    return client.send(command);
  } catch (error) {
    console.error("sendEmail ~ error", error);
    throw error;
  }
};
