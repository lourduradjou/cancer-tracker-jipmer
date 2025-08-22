import { Controller, Control } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type RationCardSelectProps = {
    control: Control<any>
}

export default function RationCardSelect({ control }: RationCardSelectProps) {
    return (
        <Controller
            control={control}
            name="rationCardColor"
            render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ration Card Color" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                </Select>
            )}
        />
    )
}
