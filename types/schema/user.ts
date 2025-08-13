import z from "zod";

// User Schema (Doctor, Asha, Nurse, Admin)
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).min(1, 'Email is required.'),
  name: z.string().min(1, 'Name is required.'),
  role: z.enum(['doctor', 'nurse', 'asha', 'admin']),
  orgId: z.string().optional(),
  assignedAsha: z.string().optional(),
});

export type UserFormInputs = z.infer<typeof UserSchema>;
export type UserDoc = z.infer<typeof UserSchema> & { id: string };
