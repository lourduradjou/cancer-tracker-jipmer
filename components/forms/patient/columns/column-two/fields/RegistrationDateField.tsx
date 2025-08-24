'use client'

import { Controller, UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { useEffect } from 'react'

interface Props {
    form: UseFormReturn<PatientFormInputs>
}

export function RegistrationDateField({ form }: Props) {
    const { control, setValue } = form

    // default today if not set
    useEffect(() => {
        if (!form.getValues('hospitalRegistrationDate')) {
            setValue('hospitalRegistrationDate', new Date().toISOString().split('T')[0])
        }
    }, [form, setValue])

    return (
        <FormField
            control={control}
            name="hospitalRegistrationDate"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">
                        Hospital Registration Date
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl className="text-muted-foreground !border-yellow-400 text-sm">
                                <Button
                                    variant="outline"
                                    className="!bg-background w-full pl-3 text-left font-normal"
                                >
                                    {field.value ? (
                                        format(new Date(field.value), 'PPP')
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) =>
                                    field.onChange(date ? date.toISOString().split('T')[0] : '')
                                }
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
