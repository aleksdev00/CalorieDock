import { z } from "zod"

export const consentFields = {
  legalAccepted: z.boolean().refine((value) => value === true, {
    message: "Agree to the Terms of Use and acknowledge the Privacy Policy.",
  }),
  healthAccepted: z.boolean().refine((value) => value === true, {
    message: "Explicit health-data consent is required to use tracking features.",
  }),
}
export const consentVersionsSchema = z.object({
  terms: z.string().min(1).max(64),
  privacy: z.string().min(1).max(64),
  health: z.string().min(1).max(64),
  legalText: z.string().min(1).max(64),
}).strict()
export const consentSchema = z.object({
  ...consentFields,
  versions: consentVersionsSchema,
  healthEventId: z.uuid().nullable(),
}).strict()
export type ConsentInput = z.infer<typeof consentSchema>
