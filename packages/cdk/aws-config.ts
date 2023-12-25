/* 
! Pre requisites to use this CDK stack
1. AWS CLI Configured with correct profile name & npm scripts (Admin access to AWS account)
2. AWS IAM User for app access (All needed services for API interaction, such as creating signed URLs, sending emails, etc.)
3. Verify Domains using Cloudflare Config
4. Configure CircleCI to push containers to ECR
*/

const appDomain = "jdwly.com";

export const stackPrefix = "main";

const environmentNames = ["development", "staging", "production"] as const;
export type EnvironmentName = (typeof environmentNames)[number];

export const IMAGE_REPO_NAMES: Record<EnvironmentName, string> = {
  development: `jdwly-api-dev`,
  staging: `jdwly-api-dev`,
  production: `jdwly-api-prod`,
} as const;

export const CONTENT_BUCKET_NAMES: Record<EnvironmentName, string> = {
  development: `${stackPrefix}-images-development`,
  staging: `${stackPrefix}-images-staging`,
  production: `${stackPrefix}-images`,
} as const;

export const UPLOAD_BUCKET_NAMES: Record<EnvironmentName, string> = {
  development: `${stackPrefix}-images-uploads-development`,
  staging: `${stackPrefix}-images-uploads-staging`,
  production: `${stackPrefix}-images-uploads`,
} as const;

export const IMAGE_OPT_LAMBDA_NAMES: Record<EnvironmentName, string> = {
  development: `${stackPrefix}-image-opt-development`,
  staging: `${stackPrefix}-image-opt-staging`,
  production: `${stackPrefix}-image-opt`,
} as const;

export const IMAGE_OPT_QUEUE_NAMES: Record<EnvironmentName, string> = {
  development: `${stackPrefix}-image-opt-queue-development`,
  staging: `${stackPrefix}-image-opt-queue-staging`,
  production: `${stackPrefix}-image-opt-queue`,
} as const;

export const DATABASE_NAMES: Record<EnvironmentName, string> = {
  development: `${stackPrefix}-db-development`,
  staging: `${stackPrefix}-db-staging`,
  production: `${stackPrefix}-db`,
} as const;

export const API_SERVICE_NAMES: Record<EnvironmentName, string> = {
  development: `${stackPrefix}-api-development`,
  staging: `${stackPrefix}-api-staging`,
  production: `${stackPrefix}-api`,
} as const;

export const IMAGES_DOMAIN_NAMES: Record<EnvironmentName, string> = {
  development: `images-development.${appDomain}`,
  staging: `images-staging.${appDomain}`,
  production: `images.${appDomain}`,
} as const;
