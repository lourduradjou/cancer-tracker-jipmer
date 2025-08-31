// table/types.ts
import { Hospital, Patient, UserDoc } from '@/schema'

export type TabDataMap = {
    patients: Patient
    hospitals: Hospital
    doctors: UserDoc
    nurses: UserDoc
    ashas: UserDoc
    removedPatients: Patient
}

export type RowDataBase = {
    id: string | number
    [key: string]: unknown
}

export type ModalType = 'view' | 'update' | 'delete'
