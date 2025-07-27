import { User as FirebaseAuthUser } from 'firebase/auth'

export type UserRole = 'doctor' | 'nurse' | 'asha' | 'admin'

export type UserDoc = {
    email: string
    role: UserRole
    orgId?: string
    assignedAsha?: string
}

export type AuthState = {
  user: FirebaseAuthUser | null;
  role: UserRole | null;
  orgId: string | null;
  isLoadingAuth: boolean;
  error: Error | null;
}
