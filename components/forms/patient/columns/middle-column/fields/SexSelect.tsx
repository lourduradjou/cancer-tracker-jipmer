import { Controller, Control } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type Props = {
    control: Control<any>
    clearGenderIncompatible: () => void
}

export default function SexSelect({ control, clearGenderIncompatible }: Props) {
    return (
        <Controller
            control={control}
            name="sex"
            render={({ field }) => (
                <Select
                    value={field.value}
                    onValueChange={(val) => {
                        field.onChange(val)
                        clearGenderIncompatible()
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Sex" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            )}
        />
    )
}
