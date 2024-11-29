import { z } from "zod"

export const PayoutFormSchema = z.object({
  dob: z.date({
    required_error: "Transaction Folder Date is required.",
  }),
})

export type PayoutFormValues = z.infer<typeof PayoutFormSchema>