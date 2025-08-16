import z from 'zod'

export const InsuranceSchema = z
    .object({
        type: z.enum(['none', 'government', 'private']),
        id: z.string().optional(),
    })
    .optional()

export const FollowUpSchema = z
    .object({
        date: z.union([z.date()]),
        remarks: z.string(),
    })
    .optional()

export const PatientSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required.')
        .max(100, "Name length can't exceed 100 characters"),
    phoneNumber: z.array(z.string().optional()).optional(),
    sex: z.enum(['male', 'female', 'other'], {
        message: 'Please select a sex.',
    }),
    dob: z.string().optional(),
    age: z
        .number()
        .min(0, 'Age must be 0 or greater.')
        .max(120, 'Age cannot exceed 120.')
        .optional(),
    address: z.string().min(1, 'Address is required.'),
    aadhaarId: z.string().optional(),
    rationCardColor: z.enum(['red', 'yellow', 'none']).optional(),
    diseases: z.array(z.string()).min(1, 'At least one disease is required.'),
    assignedHospitalId: z.string().min(1, 'Assigned PHC is required.'),
    assignedHospitalName: z.string().min(1, 'Assigned Hospital Name is empty'),
    assignedAsha: z.string().optional(),
    gpsLocation: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
    followUps: z.array(FollowUpSchema).optional(),
    status: z.enum(['Alive', 'Death', 'Ongoing', 'Followup']).optional(),
    aabhaId: z.string().optional(),
    diagnosedDate: z.string().optional(),
    diagnosedYearsAgo: z.number().optional(),
    insurance: InsuranceSchema.optional(),
    transferred: z.boolean().optional(),
    transferredFrom: z.string().optional(),
    // Fields for internal use
    hasAadhaar: z.boolean(),
    useAgeInstead: z.boolean(),
})

export type PatientFormInputs = z.infer<typeof PatientSchema>

// This type is for fetched data from the database, which always has an ID
export type Patient = PatientFormInputs & {
    id: string
}
