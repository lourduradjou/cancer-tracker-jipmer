'use client'

import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

type Props = {
    form: UseFormReturn<any>
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay (hh)', 'Rh-null']

export default function DobOrAgeField({ form }: Props) {
    const { control, watch } = form
    const useAgeInstead = watch('useAgeInstead')

    return (
        <div className="flex flex-col gap-3">
            <FormLabel className="text-muted-foreground text-sm font-medium">
                Date of Birth or Age
            </FormLabel>

            {/* Checkbox + Blood group always */}
            <div className="flex flex-row items-center gap-3">
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
                            <FormLabel className="text-muted-foreground text-sm">
                                Enter Age
                            </FormLabel>
                        </FormItem>
                    )}
                />

                {/* Blood group dropdown */}
                <FormField
                    control={control}
                    name="bloodGroup"
                    render={({ field }) => (
                        <FormItem className="w-32">
                            <FormControl>
                                <Select
                                    onValueChange={(val) =>
                                        field.onChange(val === 'none' ? null : val)
                                    }
                                    value={field.value || ''}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Add a 'None' option */}
                                        <SelectItem key="none" value="none">
                                            None
                                        </SelectItem>

                                        {BLOOD_GROUPS.map((group) => (
                                            <SelectItem key={group} value={group}>
                                                {group}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Conditional render: either DOB or Age box */}
            {useAgeInstead ? (
                // Age input
                <FormField
                    control={control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    max={120}
                                    placeholder="Enter years (e.g. 25)"
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
                                            field.onChange(dob.toISOString().split('T')[0])
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
                // DOB picker
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
                                            className="!bg-background text-muted-foreground w-full !border-red-400 pl-3 text-left font-normal"
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
                                                console.log(date, formatted)
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
