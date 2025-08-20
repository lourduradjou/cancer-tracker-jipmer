'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Pencil } from 'lucide-react'
import { db } from '@/firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { checkAadhaarDuplicateUtil } from '@/lib/patient/checkPatientRecord'
import { PatientSchema, PatientFormInputs } from '@/schema/patient'
import PatientForm from './PatientForm'

interface GenericPatientDialogProps {
    mode: 'add' | 'edit'
    trigger?: React.ReactNode
    patientData?: PatientFormInputs & { id?: string }
    onSuccess?: () => void
}

export default function GenericPatientDialog({
    mode,
    trigger,
    patientData,
    onSuccess
}: GenericPatientDialogProps) {
    const [open, setOpen] = useState(false)
    const isEdit = mode === 'edit'

    const form = useForm<PatientFormInputs>({
        resolver: zodResolver(PatientSchema),
        defaultValues: {
            name: '',
            phoneNumber: [''],
            sex: undefined,
            dob: '',
            age: undefined,
            address: '',
            aadhaarId: '',
            rationCardColor: undefined,
            diseases: [],
            assignedHospitalId: '',
            assignedHospitalName: '',
            status: 'Alive',
            hasAadhaar: true,
            useAgeInstead: false,
        },
    })

    const { handleSubmit, reset, watch, setValue } = form
    const aadhaarId = watch('aadhaarId')
    const hasAadhaar = watch('hasAadhaar')

    // Initialize form with patient data for edit mode
    useEffect(() => {
        if (isEdit && patientData && open) {
            reset(patientData)
        }
    }, [isEdit, patientData, open, reset])

    // Aadhaar duplicate check (skip for edit mode if Aadhaar hasn't changed)
    useEffect(() => {
        if (hasAadhaar && aadhaarId?.length === 12 &&
            (!isEdit || aadhaarId !== patientData?.aadhaarId)) {
            const timer = setTimeout(async () => {
                await checkAadhaarDuplicateUtil(aadhaarId)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [aadhaarId, hasAadhaar, isEdit, patientData])

    // Save to localStorage (for add mode only)
    useEffect(() => {
        if (!isEdit) {
            localStorage.setItem('addPatientFormData', JSON.stringify(form.getValues()))
        }
    }, [watch(), form, isEdit])

    // Load from localStorage (for add mode only)
    useEffect(() => {
        if (open && !isEdit) {
            const saved = localStorage.getItem('addPatientFormData')
            if (saved) {
                try {
                    reset(JSON.parse(saved))
                } catch {
                    console.warn('Invalid saved form data')
                }
            }
        }
    }, [open, reset, isEdit])

    const onSubmit = async (data: PatientFormInputs) => {
        try {
            if (isEdit && patientData?.id) {
                // Update existing patient
                await updateDoc(doc(db, 'patients', patientData.id), data)
                toast.success('Patient updated successfully.')
            } else {
                // Add new patient
                await addDoc(collection(db, 'patients'), data)
                toast.success('Patient added successfully.')
                localStorage.removeItem('addPatientFormData')
            }

            setOpen(false)
            reset()
            onSuccess?.()
        } catch (err) {
            console.error(`Error ${isEdit ? 'updating' : 'adding'} patient:`, err)
            toast.error(`Failed to ${isEdit ? 'update' : 'add'} patient. Please try again.`)
        }
    }

    const defaultTrigger = isEdit ? (
        <Button size="icon" variant="outline" title="Update">
            <Pencil className="h-4 w-4" />
        </Button>
    ) : (
        <Button variant="outline" className="cursor-pointer border-2 !border-green-400">
            <Plus className="h-4 w-4" /> Add Patient
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="min-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Update Patient Details' : 'Add New Patient Details'}
                    </DialogTitle>
                </DialogHeader>

                <PatientForm
                    form={form}
                    reset={reset}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    isEdit={isEdit}
                />
            </DialogContent>
        </Dialog>
    )
}
