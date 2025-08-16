import z from 'zod'

// Hospital Schema
export const HospitalSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Hospital name is required.'),
    address: z.string().min(1, 'Address is required.'),
    contactNumber: z.string().optional(),
})
export type HospitalFormInputs = z.infer<typeof HospitalSchema>
export type Hospital = z.infer<typeof HospitalSchema> & { id: string }
