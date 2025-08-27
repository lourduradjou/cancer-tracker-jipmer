import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import DobOrAgeField from './fields/DobOrAgeField'
import InsuranceInfo from './fields/InsuranceInfo'
import SexSelect from './fields/SexSelect'
import PatientStatusSelect from './fields/PatientStatusSelect'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { RegistrationDateField } from './fields/RegistrationDateField'

type MiddleColumnProps = {
    form: UseFormReturn<any>
    isEdit?: boolean
}

export function ColumnTwo({ form }: MiddleColumnProps) {
    const { register, control } = form

    return (
        <div className="mx-1 flex flex-col gap-4 border-x-2 px-4 md:w-1/3">
            <RegistrationDateField form={form} />
            {/* Address */}
            <FormField
                control={control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <FloatingLabelInput
                                {...field}
                                label="Address"
                                autoComplete="off"
                                className="!border-red-400"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Insurance */}
            <InsuranceInfo form={form} />

            {/* DOB or Age */}
            <DobOrAgeField form={form} />

            {/* Sex */}
            <SexSelect control={control} />

            {/* Status */}
            <PatientStatusSelect control={control} />
        </div>
    )
}
