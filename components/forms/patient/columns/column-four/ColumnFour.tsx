import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import TreatmentDropdown from './fields/TreatmentDropdrop'
import { TreatmentPeriodField } from './fields/TreatmentPeriodField'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
type RightColumnProps = {
    form: UseFormReturn<any>
    isEdit?: boolean
}

export function ColumnFour({ form, isEdit = false }: RightColumnProps) {
    const { watch, control } = form

    const suspectedCase = watch('suspectedCase')

    return (
        !suspectedCase && (
            <div className="mx-1 flex flex-col gap-4 border-l-2 px-4 md:w-1/3">
                <TreatmentPeriodField form={form} />
                <FormField
                    control={control}
                    name="hospitalRegistrationNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingLabelInput
                                    id="hospital-registration-number"
                                    label="Hospital Registration Number"
                                    autoComplete="off"
                                    {...field}
                                />
                                {/* <Input
                                    placeholder="Hospital Registration Number"
                                    autoComplete="off"
                                    {...field}
                                /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="hbcrId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingLabelInput
                                    label="Enter HBCR ID"
                                    autoComplete="off"
                                    {...field}
                                />
                                {/* <Input placeholder="Enter HBCR ID" autoComplete="off" {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="stageOfTheCancer"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FloatingLabelInput
                                    label="Enter Stage of the Cancer"
                                    autoComplete="off"
                                    {...field}
                                />
                                {/* <Input
                                    placeholder="Enter Stage of the Cancer"
                                    autoComplete="off"
                                    {...field}
                                /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                />
                                {/* <Input
                                    placeholder="Biopsy Number (If Applicable)"
                                    autoComplete="off"
                                    {...field}
                                /> */}
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
