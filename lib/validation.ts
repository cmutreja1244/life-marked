import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  business: z.string().trim().min(1, "Business name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  website: z.string().trim().optional(),
  message: z.string().trim().optional(),
  referrer: z.string().trim().optional(),
  utm_source: z.string().trim().optional(),
  utm_medium: z.string().trim().optional(),
  utm_campaign: z.string().trim().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
