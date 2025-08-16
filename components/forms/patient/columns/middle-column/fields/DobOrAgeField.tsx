import { Controller, UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

type Props = {
    form: UseFormReturn<any>
}

export default function DobOrAgeField({ form }: Props) {
    const { register, control, watch } = form

    return (
        <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-sm font-medium">
                Date of Birth or Age
            </label>

            <div className="mb-2 flex items-center gap-2">
                <Controller
                    control={control}
                    name="useAgeInstead"
                    render={({ field }) => (
                        <>
                            <Checkbox
                                id="useAge"
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                            />
                            <label htmlFor="useAge" className="text-sm">
                                Enter Age
                            </label>
                        </>
                    )}
                />
            </div>

            {watch('useAgeInstead') ? (
                <Input
                    type="number"
                    min={0}
                    max={120}
                    placeholder="Enter Age (e.g. 55)"
                    {...register('age', { valueAsNumber: true })}
                />
            ) : (
                <input
                    type="date"
                    max={format(new Date(), 'yyyy-MM-dd')}
                    {...register('dob')}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    autoComplete="off"
                />
            )}
        </div>
    )
}
