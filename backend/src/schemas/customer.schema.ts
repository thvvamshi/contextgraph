import { z } from "zod";

export const customerIdParamSchema = z.object({
  customerId: z.string().trim().min(1, "Customer ID is required"),
});

export type CustomerIdParams = z.infer<typeof customerIdParamSchema>;