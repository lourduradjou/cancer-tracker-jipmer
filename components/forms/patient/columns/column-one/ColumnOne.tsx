'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import NameField from './fields/NameField'
import AadhaarField from './fields/AadhaarField'
import PhoneNumbersField from './fields/PhoneNumbersField'
import ReligionDropdown from './fields/ReligionField'

interface LeftColumnProps {
    form: UseFormReturn<PatientFormInputs>
    isEdit?: boolean
}

export default function ColumnOne({ form, isEdit = false }: LeftColumnProps) {
    return (
        <div className="flex flex-col gap-4 md:w-1/3">
            <NameField form={form} />
            <ReligionDropdown form={form} />

            <AadhaarField form={form} />
            <PhoneNumbersField form={form} />
        </div>
    )
}
