import type { S3Handler } from "aws-lambda";
import type { Readable } from "stream";
import type { ImageExtEnum } from "@mono/validation/lib/images";
import type { ImageOptQueueMsgSchema } from "@mono/validation/sqs/image-optimization";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import sharp from "sharp";

// !important
// these values are provided by the stack to the lambda
const stackProvidedEnv = {
  CONTENT_BUCKET: process.env.CONTENT_BUCKET as string,
  AWS_STACK_REGION: process.env.AWS_STACK_REGION as string,
  IMAGE_OPT_QUEUE_URL: process.env.IMAGE_OPT_QUEUE_URL as string,
};
export type ImageOptimizationEnv = typeof stackProvidedEnv;

// create s3 client
const s3Client = new S3Client({
  region: stackProvidedEnv.AWS_STACK_REGION,
});
// create sqs client
const sqsClient = new SQSClient({ region: stackProvidedEnv.AWS_STACK_REGION });

const streamToString = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};
// base64 convert
// supported images \ mimetypes
const mimeTypeOptions = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
const mimeTypeKeys = Object.keys(mimeTypeOptions) as ImageExtEnum[];
const toBase64 = (type: ImageExtEnum, data: Buffer) => {
  const mimeType = mimeTypeOptions[type];
  const base64 = data.toString("base64");
  return `data:${mimeType};base64,${base64}`;
};

export const handler: S3Handler = async (event) => {
  console.info("[handler] Image optimization lambda starting");
  // get bucket & key from event
  const uploadBucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  try {
    // fetch object from s3
    const getObj = new GetObjectCommand({
      Bucket: uploadBucket,
      Key: key,
    });
    // determine optimized image key & image id
    const [currentKey, ext] = key.split(".");
    if (!mimeTypeKeys.includes(ext as ImageExtEnum)) {
      console.info(
        "[handler] Image optimization lambda skipping unsupported image extension"
      );
      return;
    }
    const optKey = `${currentKey}.webp`;
    const keyFragments = currentKey.split("/");
    const imageId = keyFragments[keyFragments.length - 2];
    // get object from s3
    const data = await s3Client.send(getObj);
    const body = await streamToString(data.Body as Readable);
    // base processing
    const imageBase = await sharp(body)
      .toFormat("webp")
      .resize({
        width: 2400,
        withoutEnlargement: true,
      })
      .webp({ quality: 50 });
    // optimized image
    const imageOptimized = await imageBase.clone().toBuffer();
    // lazy src
    const imageLazy = await imageBase
      .clone()
      .resize({
        width: 40,
        withoutEnlargement: true,
      })
      .toBuffer();
    // lazy base64
    const imageLazyBase64 = toBase64("webp", imageLazy);
    // create upload and delete commands
    const uploadImageCommand = new PutObjectCommand({
      Bucket: process.env.CONTENT_BUCKET,
      Key: optKey,
      Body: imageOptimized,
    });
    const deleteObjCommand = new DeleteObjectCommand({
      Bucket: uploadBucket,
      Key: key,
    });
    // prepare message for sqs
    const queueMessageBody: ImageOptQueueMsgSchema = {
      imageId,
      imageLazyBase64,
    };
    const queueMessage = new SendMessageCommand({
      QueueUrl: stackProvidedEnv.IMAGE_OPT_QUEUE_URL,
      DelaySeconds: 0,
      MessageAttributes: {
        createdAt: {
          DataType: "String",
          StringValue: new Date().toISOString(),
        },
      },
      MessageBody: JSON.stringify(queueMessageBody),
    });
    // perform all operations in parallel
    await Promise.all([
      s3Client.send(uploadImageCommand),
      s3Client.send(deleteObjCommand),
      sqsClient.send(queueMessage),
    ]);
  } catch (err) {
    console.error(err);
  }
};
