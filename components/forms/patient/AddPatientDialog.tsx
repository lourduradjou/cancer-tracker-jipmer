'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PatientSchema, PatientFormInputs } from '@/schema/patient'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import PatientForm from './PatientForm'
import { checkAadhaarDuplicateUtil } from '@/lib/patient/checkPatientRecord'

export default function AddPatientDialog() {
    const [open, setOpen] = useState(false)

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

    const { handleSubmit, reset, watch } = form
    const aadhaarId = watch('aadhaarId')
    const hasAadhaar = watch('hasAadhaar')

    // Aadhaar duplicate check
    useEffect(() => {
        if (hasAadhaar && aadhaarId?.length === 12) {
            const timer = setTimeout(async () => {
                await checkAadhaarDuplicateUtil(aadhaarId)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [aadhaarId, hasAadhaar])

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('addPatientFormData', JSON.stringify(form.getValues()))
    }, [watch(), form])

    // Load from localStorage
    useEffect(() => {
        if (open) {
            const saved = localStorage.getItem('addPatientFormData')
            if (saved) {
                try {
                    reset(JSON.parse(saved))
                } catch {
                    console.warn('Invalid saved form data')
                }
            }
        }
    }, [open, reset])

    const onSubmit = async (data: PatientFormInputs) => {
        try {
            await addDoc(collection(db, 'patients'), data)
            toast.success('Patient added successfully.')
            setOpen(false)
            reset()
            localStorage.removeItem('addPatientFormData')
        } catch (err) {
            console.error('Error adding patient:', err)
            toast.error('Failed to add patient. Please try again.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer border-2 !border-green-400">
                    <Plus className="h-4 w-4" /> Add Patient
                </Button>
            </DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="min-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Add New Patient Details</DialogTitle>
                </DialogHeader>

                {/* Pass `form` so PatientForm can use RHF hooks */}
                <PatientForm
                    form={form}
                    reset={reset}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}
