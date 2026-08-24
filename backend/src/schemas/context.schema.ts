import { z } from "zod";

export const showcaseContextQuerySchema = z.object({
  customerTier: z.string().trim().min(1, "Customer tier is required"),
});

export type ShowcaseContextQuery = z.infer<
  typeof showcaseContextQuerySchema
>;