'use client'

import { X } from 'lucide-react'
import { useRef } from 'react'
import { useFieldArray, UseFormHandleSubmit, UseFormReset, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'

import { AVAILABLE_DISEASES_LIST } from '@/constants/diseases'

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
}

export default function PatientForm({ form, reset, handleSubmit, onSubmit }: PatientFormProps) {
    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = form

    // ------------------- Aadhaar (3-part UI, single field in form: aadhaarId) -------------------
    const aadhaarId = watch('aadhaarId') || ''

    console.log('see my')

    const clamp12 = (s: string) => (s || '').replace(/\D/g, '').slice(0, 12)
    const getPart = (idx: 0 | 1 | 2) => clamp12(aadhaarId).slice(idx * 4, idx * 4 + 4)

    const aadhaarRefs = useRef<Array<HTMLInputElement | null>>([])
    // ------------------- Sex + diseases logic -------------------
    const sex = watch('sex') as 'male' | 'female' | 'other' | undefined
    const selectedDiseases: string[] = watch('diseases') || []

    const allKnownLabels = new Set(
        [...AVAILABLE_DISEASES_LIST.solid, ...AVAILABLE_DISEASES_LIST.blood].map((d) => d.label)
    )

    const toggleDisease = (label: string, checked: boolean) => {
        const next = checked
            ? Array.from(new Set([...(selectedDiseases || []), label]))
            : (selectedDiseases || []).filter((d) => d !== label)
        setValue('diseases', next, { shouldDirty: true, shouldValidate: true })
    }

    const clearGenderIncompatible = () => {
        // if sex changes, drop diseases that are gender-specific to the other sex
        type DiseaseItem = { label: string; gender?: 'male' | 'female' }
        const allowed = (item: DiseaseItem) => {
            if (!item.gender) return true
            if (!sex || sex === 'other') return true
            return item.gender === sex
        }
        const validKnown = ([...AVAILABLE_DISEASES_LIST.solid, ...AVAILABLE_DISEASES_LIST.blood] as DiseaseItem[])
            .filter(allowed)
            .map((d) => d.label)
        const next = (selectedDiseases || []).filter(
            (d) => !allKnownLabels.has(d) || validKnown.includes(d)
        )
        setValue('diseases', next, { shouldDirty: true })
    }

    // ------------------- Custom disease entry (optional) -------------------
    const customDisease = (selectedDiseases || []).find((d) => !allKnownLabels.has(d)) || ''
    const isCustomDiseaseSelected = Boolean(customDisease)

    const toggleCustomDisease = (checked: boolean) => {
        if (!checked) {
            const next = (selectedDiseases || []).filter((d) => allKnownLabels.has(d))
            setValue('diseases', next, { shouldDirty: true })
        } else {
            // add empty placeholder to let the input control the value
            setValue('diseases', [...(selectedDiseases || []), ''], { shouldDirty: true })
        }
    }

    const updateCustomDisease = (value: string) => {
        const keepKnown = (selectedDiseases || []).filter((d) => allKnownLabels.has(d))
        const next = value ? [...keepKnown, value] : keepKnown
        setValue('diseases', next, { shouldDirty: true })
    }

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
                    <LeftColumn form={form} />

                    {/* ======================= MIDDLE COLUMN ======================= */}
                    <MiddleColumn form={form} clearGenderIncompatible={clearGenderIncompatible} />

                    {/* ======================= RIGHT COLUMN ======================= */}
                    <RightColumn
                        form={form}
                        sex={sex}
                        selectedDiseases={selectedDiseases}
                        toggleDisease={toggleDisease}
                        isCustomDiseaseSelected={isCustomDiseaseSelected}
                        toggleCustomDisease={toggleCustomDisease}
                        customDisease={customDisease}
                        updateCustomDisease={updateCustomDisease}
                    />
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
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
