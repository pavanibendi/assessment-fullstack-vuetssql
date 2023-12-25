import { object, string } from "zod";
import type { z } from "zod";

// sqs image optimization message
export const imageOptQueueMsgSchema = object({
  imageId: string().uuid(),
  imageLazyBase64: string(),
});
export type ImageOptQueueMsgSchema = z.infer<typeof imageOptQueueMsgSchema>;
