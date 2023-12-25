import { array, object, string, unknown } from "zod";
import type { z } from "zod";

// pageCreate
export const pageCreateSchema = object({
  websiteId: string().uuid(),
  slug: string(),
  title: string().optional(),
  description: string().optional(),
});
export type PageCreateSchema = z.infer<typeof pageCreateSchema>;

// pageUpdate
export const pageUpdateSchema = pageCreateSchema.extend({
  id: string().uuid(),
  slug: pageCreateSchema.shape.slug.default(""),
});
export type PageUpdateSchema = z.infer<typeof pageUpdateSchema>;

// pageTreeUpdate
export const pageTreeUpdateSchema = object({
  websiteId: string().uuid(),
  pageTree: array(unknown()),
});
export type PageTreeUpdateSchema = z.infer<typeof pageTreeUpdateSchema>;
