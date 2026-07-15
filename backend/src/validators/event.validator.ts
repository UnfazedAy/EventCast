import { z } from "../lib/zod";

export const assessEventSchema = z.object({
  eventName: z
    .string()
    .trim()
    .min(1, "Event name is required")
    .max(200, "Event name must be at most 200 characters")
    .meta({ example: "Wedding Ceremony" }),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(200, "Location must be at most 200 characters")
    .meta({ example: "Lekki" }),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Event date must be in YYYY-MM-DD format")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Event date must be a valid date",
    })
    .meta({ example: "2026-07-20" }),
});

export type AssessEventDto = z.infer<typeof assessEventSchema>;
