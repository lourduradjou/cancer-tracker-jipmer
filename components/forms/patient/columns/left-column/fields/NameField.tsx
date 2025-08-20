'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface NameFieldProps {
    form: UseFormReturn<PatientFormInputs>
    isEdit?: boolean
}

export default function NameField({ form, isEdit = false }: NameFieldProps) {
    const { control } = form
    return (
        <FormField
            control={control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input placeholder="Full Name" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
