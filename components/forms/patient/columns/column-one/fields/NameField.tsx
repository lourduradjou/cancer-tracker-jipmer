'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'

interface NameFieldProps {
    form: UseFormReturn<PatientFormInputs>
    isEdit?: boolean
}

export default function NameField({ form, isEdit = false }: NameFieldProps) {
    const { control } = form
    return (
        <>
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabelInput
                                id="patient-name"
                                data-testid="patient-name-input"
                                label="Patient Name"
                                autoComplete="off"
                                {...field}
                                className="!border-red-400"
                            />
                        </FormControl>
                        <FormMessage data-testid="name-error" />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="caregiverName"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabelInput
                                id="caregiver-name"
                                label="Caregiver Name"
                                autoComplete="off"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}
