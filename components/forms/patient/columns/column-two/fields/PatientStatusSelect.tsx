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

export default function PatientStatusSelect({ control }: Props) {
    return (
        <Controller
            control={control}
            name="patientStatus"
            render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full" required={true}>
                        <SelectValue className="tracking-wider">
                            {field.value ? (
                                <span
                                    className={cn('font-medium', {
                                        'text-green-400': field.value === 'Alive',
                                        'text-red-400': field.value === 'Death',
                                        'text-blue-400': field.value === 'Not Available',
                                        // 'text-yellow-600': field.value === 'Followup',
                                    })}
                                >
                                    {field.value}
                                </span>
                            ) : (
                                'Select Status'
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="tracking-wider">
                        <SelectItem value="Alive">
                            <span className="text-green-400">Alive</span>
                        </SelectItem>
                        <SelectItem value="Death">
                            <span className="text-red-400">Death</span>
                        </SelectItem>
                        <SelectItem value="Not Available">
                            <span className="text-blue-400">Not Available</span>
                        </SelectItem>
                        {/* <SelectItem value="Followup">
                            <span className="text-yellow-600">Followup</span>
                        </SelectItem> */}
                    </SelectContent>
                </Select>
            )}
        />
    )
}
