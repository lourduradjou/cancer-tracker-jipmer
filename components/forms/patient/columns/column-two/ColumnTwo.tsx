import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import DobOrAgeField from './fields/DobOrAgeField'
import InsuranceInfo from './fields/InsuranceInfo'
import SexSelect from './fields/SexSelect'
import StatusSelect from './fields/StatusSelect'

type MiddleColumnProps = {
    form: UseFormReturn<any>
    isEdit?: boolean
}

export default function ColumnTwo({ form}: MiddleColumnProps) {
    const { register, control } = form

    return (
        <div className="mx-1 flex flex-col gap-4 border-x-2 px-4 md:w-1/3">
            {/* Address */}
            <Input autoComplete="off" placeholder="Address" {...register('address')} />

            {/* Insurance */}
            <InsuranceInfo form={form} />

            {/* DOB or Age */}
            <DobOrAgeField form={form} />

            {/* Sex */}
            <SexSelect control={control} />
            <SexSelect control={control} />

            {/* Status */}
            <StatusSelect control={control} />
        </div>
    )
}
