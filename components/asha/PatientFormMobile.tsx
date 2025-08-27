'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PatientFormInputs, PatientSchema } from '@/schema/patient'
import { ColumnOne, ColumnTwo, ColumnThree, ColumnFour, ColumnFive } from '../forms/patient'
import { updatePatient } from '@/lib/api/patient.api'
import { toast } from 'sonner'
import { Patient } from '@/schema'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'

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
                console.log('✅ Form submitted with values:', values)
                setIsSaving(true)
                if (!patient.id) throw new Error('Patient ID missing')

                const cleanValues: PatientFormInputs = Object.fromEntries(
                    Object.entries(values).filter(([_, v]) => v !== undefined)
                ) as PatientFormInputs

                await updatePatient(patient.id, cleanValues)
                toast.success('Patient updated successfully!')

                queryClient.invalidateQueries({
                    queryKey: ['patients', { ashaId: userId }],
                })
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

    const columns = [
        <ColumnOne key="col1" form={form} isEdit />,
        <ColumnTwo key="col2" form={form} isEdit />,
        <ColumnThree key="col3" form={form} isEdit />,
        <ColumnFour key="col4" form={form} isEdit />,
        <ColumnFive key="col5" form={form} isEdit />,
    ]

    const handlers = useSwipeable({
        onSwipedLeft: () => setActiveIndex((prev) => Math.min(prev + 1, columns.length - 1)),
        onSwipedRight: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
        preventScrollOnSwipe: true,
        trackMouse: true,
    })

    return (
        <FormProvider {...form}>
            <div className="w-full max-w-[600px] rounded-lg border shadow-sm">
                {/* Header (always visible, clickable) */}
                {/* -------------------------------------------------------- */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full max-w-[520px] items-center justify-between p-4 text-left md:max-w-[800px]"
                >
                    <div>
                        <p className="font-medium">{patient.name || 'Unnamed Patient'}</p>
                        <p className="text-sm text-gray-600">{patient.address || 'No address'}</p>
                    </div>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {/* -------------------------------------------------------- */}

                {/* Expandable content Patient container */}
                {isOpen && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex h-full w-full flex-col border-t p-6"
                    >
                        <div className="flex w-full flex-col justify-center">
                            {/* Swipeable wrapper */}
                            <div {...handlers} className="relative w-full overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300"
                                    style={{
                                        transform: `translateX(-${activeIndex * 100}vw)`,
                                        width: `${columns.length * 100}vw`,
                                    }}
                                >
                                    {columns.map((column, i) => (
                                        <div key={i} className="flex w-[100vw] justify-center">
                                            <div className="w-full px-4">
                                                {/* Render the whole column (column five is only for asha page) */}
                                                {column}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dots indicator */}
                            <div className="mt-4 flex justify-center gap-2">
                                {columns.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setActiveIndex(i)}
                                        className={`h-4 w-4 rounded-full ${
                                            i === activeIndex ? 'bg-blue-600' : 'bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Submit button */}
                            <div className="mt-4 flex w-full justify-center space-x-6 px-4">
                                <button
                                    type="submit"
                                    className="w-full max-w-[520px] cursor-pointer rounded bg-blue-600 p-2 text-white"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                {/* Done Button with Confirmation */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="w-full max-w-[250px] cursor-pointer rounded bg-green-600 p-2 text-white"
                                            disabled={isSaving}
                                        >
                                            Done / Finished
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Mark as Finished?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will unassign the patient from the ASHA. Are
                                                you sure you want to continue?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-green-600 text-white hover:bg-green-700"
                                                onClick={async () => {
                                                    try {
                                                        setIsSaving(true)
                                                        if (!patient.id)
                                                            throw new Error('Patient ID missing')

                                                        await updatePatient(patient.id, {
                                                            assignedAsha: 'none',
                                                        })
                                                        toast.success(
                                                            'Patient marked as finished and unassigned.'
                                                        )
                                                    } catch (err) {
                                                        console.error(err)
                                                        toast.error('Failed to update patient.')
                                                    } finally {
                                                        setIsSaving(false)
                                                    }
                                                }}
                                            >
                                                Confirm
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </FormProvider>
    )
}
