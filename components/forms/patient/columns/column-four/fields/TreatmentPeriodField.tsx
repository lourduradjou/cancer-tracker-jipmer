'use client'

import { Controller, UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

interface Props {
    form: UseFormReturn<PatientFormInputs>
}

export function TreatmentPeriodField({ form }: Props) {
    const { control } = form

    return (
        <div className="space-y-4">
            {/* Start Date */}
            <FormField
                control={control}
                name="treatmentStartDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">
                            Treatment Start Date
                        </FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl className="text-muted-foreground text-sm">
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
                                        field.onChange(
                                            date ? date.toISOString().split('T')[0] : null
                                        )
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* End Date */}
            <FormField
                control={control}
                name="treatmentEndDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">
                            Treatment End Date
                        </FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl className="text-muted-foreground text-sm">
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
                                        field.onChange(
                                            date ? date.toISOString().split('T')[0] : null
                                        )
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
