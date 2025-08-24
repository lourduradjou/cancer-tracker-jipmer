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

type Props = {
    form: UseFormReturn<any>
}

export default function DobOrAgeField({ form }: Props) {
    const { control, watch } = form

    return (
        <div className="flex flex-col gap-3">
            <FormLabel className="text-muted-foreground text-sm font-medium">
                Date of Birth or Age
            </FormLabel>

            {/* Toggle */}
            <FormField
                control={control}
                name="useAgeInstead"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                            <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                            />
                        </FormControl>
                        <FormLabel className="text-muted-foreground text-sm">Enter Age</FormLabel>
                    </FormItem>
                )}
            />

            {/* If age */}
            {watch('useAgeInstead') ? (
                <FormField
                    control={control}
                    name="dob" // store the computed dob directly
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className='!border-yellow-400'>
                                <Input
                                    type="number"
                                    min={0}
                                    max={120}
                                    placeholder="Enter years ago (e.g. 5)"
                                    value={
                                        field.value
                                            ? Math.floor(
                                                  new Date().getFullYear() -
                                                      new Date(field.value).getFullYear()
                                              )
                                            : ''
                                    }
                                    onChange={(e) => {
                                        const years = Number(e.target.value)
                                        if (!isNaN(years)) {
                                            const dob = new Date()
                                            dob.setFullYear(dob.getFullYear() - years)
                                            field.onChange(dob.toISOString().split('T')[0]) // store as ISO string
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
                // If dob
                <FormField
                    control={control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="!border-yellow-400 !bg-background w-full pl-3 text-left font-normal text-muted-foreground"
                                        >
                                            {field.value ? (
                                                format(new Date(field.value), 'PPP')
                                            ) : (
                                                <span>Select Date of Birth</span>
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
                                            onSelect={(date) =>
                                                field.onChange(
                                                    date ? date.toISOString().split('T')[0] : ''
                                                )
                                            }
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
