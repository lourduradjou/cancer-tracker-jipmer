'use client'

import { X } from 'lucide-react'
import { UseFormHandleSubmit, UseFormReset, UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { PatientFormInputs } from '@/schema/patient'
import { Form } from '@/components/ui/form'
import LeftColumn from './columns/left-column/LeftColumn'
import MiddleColumn from './columns/middle-column/MiddleColumn'
import RightColumn from './columns/right-column/RightColumn'

interface PatientFormProps {
    form: UseFormReturn<PatientFormInputs>
    reset: UseFormReset<PatientFormInputs>
    handleSubmit: UseFormHandleSubmit<PatientFormInputs>
    onSubmit: (data: PatientFormInputs) => Promise<void>
    isEdit?: boolean
}

export default function PatientForm({
    form,
    reset,
    handleSubmit,
    onSubmit,
    isEdit = false,
}: PatientFormProps) {
    const {
        formState: { errors },
    } = form
    console.log('Form errors:', errors)

    // ---------- UI ----------
    return (
        // keep this a form to preserve semantics, but don't submit here
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid min-w-full gap-6 py-4 select-none"
            >
                <div className="flex w-full flex-col gap-6 md:flex-row">
                    {/* LEFT COLUMN */}
                    <LeftColumn form={form} isEdit={isEdit} />

                    {/* MIDDLE COLUMN */}
                    <MiddleColumn form={form} isEdit={isEdit} />

                    {/* RIGHT COLUMN */}
                    <RightColumn form={form} isEdit={isEdit} />
                </div>
                <div className="mt-6 flex justify-between gap-2">
                    <Button
                        variant="outline"
                        onClick={() => reset()}
                        type="button"
                        className="h-12 w-[20%] border-red-500 text-red-600"
                    >
                        <X className="h-4 w-4" /> Clear
                    </Button>
                    <Button type="submit" className="h-12 w-[80%]">
                        {isEdit ? 'Update' : 'Save'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
