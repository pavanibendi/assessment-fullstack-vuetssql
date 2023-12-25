import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import type { ImageExtEnum } from "@mono/validation/lib/images";
// environment constants
// todo: import from config files instead
const bucketName = "main-images-uploads-development";
const distributionUrl = "dd75l3kwl7igb.cloudfront.net";

// init client
const s3client = new S3Client({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

interface PresignedPostInput {
  imageId: string;
  websiteId: string;
  version: number;
  originalSize: number;
  imageExt: ImageExtEnum;
}
export const presignedUploadUrl = async ({
  imageId,
  websiteId,
  version,
  originalSize,
  imageExt,
}: PresignedPostInput) => {
  const signedUrlResult = await createPresignedPost(s3client, {
    Bucket: bucketName,
    Key: `website/${websiteId}/images/${imageId}/${version}.${imageExt}`,
    Conditions: [["content-length-range", 0, originalSize]],
    Expires: 60 * 60 * 24,
  });
  return signedUrlResult;
};
export const buildImageUrl = ({
  imageId,
  websiteId,
  version,
  imageExt = "webp",
}: Omit<PresignedPostInput, "originalSize">) => {
  return `https://${distributionUrl}/website/${websiteId}/images/${imageId}/${version}.${imageExt}`;
};
