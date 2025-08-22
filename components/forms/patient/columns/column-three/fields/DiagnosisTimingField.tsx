import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'

type DiagnosisTimingFieldProps = {
    form: UseFormReturn<any>
}

export default function DiagnosisTimingField({ form }: DiagnosisTimingFieldProps) {
    const { register } = form

    return (
        <div className="space-y-4">
            <label className="flex flex-col">
                <span className="text-muted-foreground text-sm">Diagnosed Date</span>
                <Input type="date" {...register('diagnosedDate')} />
            </label>

            <label className="flex flex-col">
                <span className="text-muted-foreground text-sm">Or Years Ago</span>
                <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 2"
                    {...register('diagnosedYearsAgo', { valueAsNumber: true })}
                />
            </label>
        </div>
    )
}
