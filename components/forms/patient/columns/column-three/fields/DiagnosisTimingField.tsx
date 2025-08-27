'use client'

import { UseFormReturn, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'

type DiagnosisTimingFieldProps = {
    form: UseFormReturn<any>
}

export default function DiagnosisTimingField({ form }: DiagnosisTimingFieldProps) {
    const { control, watch } = form

    return (
        <div className="flex flex-col gap-3">
            <FormLabel className="text-muted-foreground text-sm font-medium">
                Diagnosed Date or Years Ago
            </FormLabel>

            {/* Toggle */}
            <FormField
                control={control}
                name="useYearsAgoInstead"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                            <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                            />
                        </FormControl>
                        <FormLabel className="text-muted-foreground text-sm">
                            Enter Years Ago
                        </FormLabel>
                    </FormItem>
                )}
            />

            {/* If years ago */}
            {watch('useYearsAgoInstead') ? (
                <FormField
                    control={control}
                    name="diagnosedDate" // store computed date directly
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="">
                                <Input
                                    type="number"
                                    min={0}
                                    max={120}
                                    placeholder="Enter years ago (e.g. 2)"
                                    value={
                                        field.value
                                            ? new Date().getFullYear() -
                                              new Date(field.value).getFullYear()
                                            : ''
                                    }
                                    onChange={(e) => {
                                        const years = Number(e.target.value)
                                        if (!isNaN(years)) {
                                            const diagnosedDate = new Date()
                                            diagnosedDate.setFullYear(
                                                diagnosedDate.getFullYear() - years
                                            )
                                            field.onChange(
                                                diagnosedDate.toISOString().split('T')[0]
                                            )
                                        } else {
                                            field.onChange('')
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ) : (
                // If exact date
                <FormField
                    control={control}
                    name="diagnosedDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="!bg-background text-muted-foreground w-full pl-3 text-left font-normal"
                                        >
                                            {field.value ? (
                                                format(new Date(field.value), 'PPP')
                                            ) : (
                                                <span>Select Diagnosed Date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="p-0">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            selected={
                                                field.value ? new Date(field.value) : undefined
                                            }
                                            onSelect={(date) => {
                                                if (!date) {
                                                    field.onChange('')
                                                    return
                                                }
                                                const year = date.getFullYear()
                                                const month = String(date.getMonth() + 1).padStart(
                                                    2,
                                                    '0'
                                                )
                                                const day = String(date.getDate()).padStart(2, '0')
                                                const formatted = `${year}-${month}-${day}`
                                                // console.log(date, formatted) // for debugging
                                                field.onChange(formatted)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    )
}
