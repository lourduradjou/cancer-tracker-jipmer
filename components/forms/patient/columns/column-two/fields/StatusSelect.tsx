import { Controller, Control } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type Props = {
    control: Control<any>
}

export default function StatusSelect({ control }: Props) {
    return (
        <Controller
            control={control}
            name="status"
            render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue>
                            {field.value ? (
                                <span
                                    className={cn('font-medium', {
                                        'text-green-600': field.value === 'Alive',
                                        'text-red-600': field.value === 'Death',
                                        'text-blue-600': field.value === 'Ongoing',
                                        'text-yellow-600': field.value === 'Followup',
                                    })}
                                >
                                    {field.value}
                                </span>
                            ) : (
                                'Select Status'
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Alive">
                            <span className="text-green-600">Alive</span>
                        </SelectItem>
                        <SelectItem value="Death">
                            <span className="text-red-600">Death</span>
                        </SelectItem>
                        <SelectItem value="Ongoing">
                            <span className="text-blue-600">Ongoing</span>
                        </SelectItem>
                        <SelectItem value="Followup">
                            <span className="text-yellow-600">Followup</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            )}
        />
    )
}
