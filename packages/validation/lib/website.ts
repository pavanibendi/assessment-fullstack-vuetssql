import { object, string, boolean } from "zod";
import type { z } from "zod";

// websiteCreate
export const websiteCreateSchema = object({
  subdomain: string()
    .min(3)
    .max(63)
    .regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/),
  title: string().optional(),
  description: string().optional(),
});
export type WebsiteCreateSchema = z.infer<typeof websiteCreateSchema>;

// websiteUpdate
export const websiteUpdateSchema = websiteCreateSchema
  .extend({
    id: string().uuid(),
    faviconUrl: string().url().optional(),
    logoUrl: string().url().optional(),
    isSinglePageNav: boolean().optional(),
  })
  .omit({ subdomain: true });
export type WebsiteUpdateSchema = z.infer<typeof websiteUpdateSchema>;
