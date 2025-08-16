'use client'

import React from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import { Button } from '@/components/ui/button'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { PhoneInput } from '@/components/ui/phone-input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const MAX_PHONE_NUMBERS = 10

interface PhoneNumbersFieldProps {
    form: UseFormReturn<PatientFormInputs>
}

export default function PhoneNumbersField({ form }: PhoneNumbersFieldProps) {
    const { control } = form
    const { fields, append, remove } = useFieldArray({ control, name: 'followUps' })

    return (
        <FormItem>
            <FormLabel>Phone Numbers (Max {MAX_PHONE_NUMBERS})</FormLabel>
            <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={control}
                            name={`phoneNumber.${index}`}
                            render={({ field }) => (
                                <FormControl>
                                    <PhoneInput
                                        {...field}
                                        placeholder="Enter phone number"
                                        className="flex-grow"
                                        defaultCountry="IN"
                                        value={field.value || ''}
                                        onChange={(val: string) => field.onChange(val)}
                                    />
                                </FormControl>
                            )}
                        />
                        {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <MinusCircle className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                {fields.length < MAX_PHONE_NUMBERS && (
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-fit px-2"
                        onClick={() => append({ date: '', remarks: '' })}
                    >
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Add phone
                    </Button>
                )}
            </div>
            <FormMessage />
        </FormItem>
    )
}
