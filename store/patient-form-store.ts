// store/patient-form-store.ts
import { create } from 'zustand'
import { PatientFormInputs } from '@/schema/patient'
import { UseFormReturn } from 'react-hook-form'

interface PatientFormStore {
    mode: 'add' | 'edit'
    isOpen: boolean
    patientData?: PatientFormInputs & { id?: string }
    trigger?: React.ReactNode
    onSuccess?: () => void
    setMode: (mode: 'add' | 'edit') => void
    openDialog: (
        mode: 'add' | 'edit',
        patientData?: PatientFormInputs & { id?: string },
        trigger?: React.ReactNode,
        onSuccess?: () => void
    ) => void
    closeDialog: () => void
    reset: () => void
}

export const usePatientFormStore = create<PatientFormStore>((set) => ({
    mode: 'add',
    isOpen: false,
    patientData: undefined,
    trigger: undefined,
    onSuccess: undefined,

    setMode: (mode) => set({ mode }),

    openDialog: (mode, patientData, trigger, onSuccess) =>
        set({
            isOpen: true,
            mode,
            patientData,
            trigger,
            onSuccess,
        }),

    closeDialog: () =>
        set({
            isOpen: false,
            patientData: undefined,
            trigger: undefined,
            onSuccess: undefined,
        }),

    reset: () =>
        set({
            mode: 'add',
            isOpen: false,
            patientData: undefined,
            trigger: undefined,
            onSuccess: undefined,
        }),
}))
