'use client'

import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import TreatmentDropdown from './fields/TreatmentDropdrop'
import { TreatmentPeriodField } from './fields/TreatmentPeriodField'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { PatientFormInputs } from '@/schema/patient'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select'
import clsx from 'clsx'

type RightColumnProps = {
    form: UseFormReturn<PatientFormInputs>
    isAsha?: boolean
}

export function ColumnFour({ form, isAsha = false }: RightColumnProps) {
    const { watch, control } = form

    const suspectedCase = watch('suspectedCase')

    return (
        !suspectedCase && (
            <div className={clsx('flex w-full flex-col sm:border-l-2 md:pl-4 gap-4 md:w-1/2 lg:w-1/3', isAsha && 'md:w-2/3 lg:w-full border-none px-2 mx-auto')} >
                <TreatmentPeriodField form={form} />
                
                <FormField
                    control={control}
                    name="hospitalRegistrationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingLabelInput
                                    id="hospital-registration-number"
                                    label="Hospital Registration Number"
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={control}
                    name="hbcrID"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingLabelInput
                                    label="Enter HBCR ID"
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Stage of the Cancer */}
                <div className="flex flex-col gap-2">
                    <FormLabel className="text-muted-foreground text-sm">Stage of the Cancer</FormLabel>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FormField
                            control={control}
                            name="stageOfTheCancer.stage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Stage 0">Stage 0</SelectItem>
                                                <SelectItem value="Stage I">Stage I</SelectItem>
                                                <SelectItem value="Stage II">Stage II</SelectItem>
                                                <SelectItem value="Stage III">Stage III</SelectItem>
                                                <SelectItem value="Stage IV">Stage IV</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="stageOfTheCancer.subStage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select sub-stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A">A</SelectItem>
                                                <SelectItem value="B">B</SelectItem>
                                                <SelectItem value="C">C</SelectItem>
                                                <SelectItem value="D">D</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={control}
                    name="biopsyNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingLabelInput
                                    label="Biopsy Number (If Applicable)"
                                    autoComplete="off"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* NEW: Triage Level Field */}
                <FormField
                    control={control}
                    name="triageLevel"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground px-1">Select Triage Level</span>
                            <FormControl>
                                <select 
                                    {...field} 
                                    value={field.value || ""} 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="" disabled>-- Choose Urgency Level --</option>
                                    <option value="critical">🔴 Critical</option>
                                    <option value="high">🟠 High</option>
                                    <option value="urgent">🟡 Urgent</option>
                                    <option value="non-urgent">🟢 Non-Urgent</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <TreatmentDropdown form={form} />
            </div>
        )
    )
}