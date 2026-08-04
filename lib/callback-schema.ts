import { z } from "zod";

export const callbackSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(5)
    .max(40)
    .regex(/^[+0-9 ()/.-]+$/, "invalid phone characters"),
  preferredTime: z.enum(["sofort", "vormittags", "nachmittags", "abends"]),
  topic: z
    .enum([
      "umzug",
      "renovierung",
      "entruempelung",
      "besichtigungsservice",
      "paket-privatumzug",
      "paket-firmenumzug",
      "paket-vermieter",
      "b2b",
      "sonstiges",
    ])
    .optional(),
  message: z.string().trim().max(2000).optional(),
  partnerType: z.enum(["vermittler", "firmenkunde"]).optional(),
  companyName: z.string().trim().max(200).optional(),
  consent: z.literal(true),
  locale: z.enum(["de", "en"]),
  sourcePage: z.string().max(200),
});

export type CallbackRequest = z.infer<typeof callbackSchema>;
