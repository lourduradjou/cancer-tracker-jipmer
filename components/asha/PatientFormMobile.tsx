'use client'

import { useAuth } from '@/contexts/AuthContext'
import { updatePatient } from '@/lib/api/patient.api'
import { Patient } from '@/schema'
import { PatientFormInputs, PatientSchema } from '@/schema/patient'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ColumnFive, ColumnFour, ColumnOne, ColumnThree, ColumnTwo } from '../forms/patient'
import { PatientHeader, SwipeableColumns, ActionButtons } from '.'

export default function PatientFormMobile({ patient }: { patient: Patient }) {
    const { userId } = useAuth()
    const [isSaving, setIsSaving] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const form = useForm<PatientFormInputs>({
        resolver: zodResolver(PatientSchema),
        defaultValues: {
            ...patient,
            followUps: patient.followUps ?? [],
            gpsLocation: patient.gpsLocation ?? null,
        },
    })

    const handleSubmit = form.handleSubmit(
        async (values) => {
            try {
                setIsSaving(true)
                if (!patient.id) throw new Error('Patient ID missing')

                const cleanValues = Object.fromEntries(
                    Object.entries(values).filter(([_, v]) => v !== undefined)
                ) as PatientFormInputs

                await updatePatient(patient.id, cleanValues)
                toast.success('Patient updated successfully!')

                queryClient.invalidateQueries({ queryKey: ['patients', { ashaId: userId }] })
            } catch (err) {
                console.error(err)
                toast.error('Failed to save changes. Try again.')
            } finally {
                setIsSaving(false)
            }
        },
        (errors) => {
            console.error('❌ Validation errors:', errors)
            toast.error('Please fix validation errors before saving.')
        }
    )

    const handleDone = useCallback(async () => {
        try {
            setIsSaving(true)
            if (!patient.id) throw new Error('Patient ID missing')

            await updatePatient(patient.id, { assignedAsha: 'none' })
            toast.success('Patient marked as finished and unassigned.')
        } catch (err) {
            console.error(err)
            toast.error('Failed to update patient.')
        } finally {
            setIsSaving(false)
        }
    }, [patient.id])

    const columns = [
        <ColumnOne key="col1" form={form} isAsha />,
        <ColumnTwo key="col2" form={form} isAsha />,
        <ColumnThree key="col3" form={form} isAsha />,
        !patient.suspectedCase && <ColumnFour key="col4" form={form} isAsha />,
        <ColumnFive key="col5" form={form} isAsha />,
    ]

    return (
        <FormProvider {...form}>
            <div className="w-full max-w-[1440px] rounded-lg border pb-6 shadow-sm">
                <PatientHeader
                    name={patient.name}
                    address={patient.address}
                    isOpen={isOpen}
                    onToggle={() => setIsOpen(!isOpen)}
                />

                {isOpen && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-center border-t px-4 py-2"
                    >
                        <SwipeableColumns
                            columns={columns}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                        />
                        <ActionButtons
                            isSaving={isSaving}
                            onSave={handleSubmit}
                            onDone={handleDone}
                        />
                    </form>
                )}
            </div>
        </FormProvider>
    )
}
