import { z } from "zod";
// image extension validation
const EXTENSIONS_ENUM = ["jpg", "jpeg", "png", "webp"] as const;
export const imageExtValidation = z.enum(EXTENSIONS_ENUM);
export type ImageExtEnum = z.infer<typeof imageExtValidation>;

// todo: extend to allow for more image types such as svg, gif, avif, tiff, bmp
