import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectLabel,
} from '@/components/ui/select'
import { PatientFormInputs } from '@/schema/patient'
import { Label } from '@/components/ui/label'
import { SelectGroup } from '@radix-ui/react-select'

interface ReligionDropdownProps {
    form: UseFormReturn<PatientFormInputs>
    isEdit?: boolean
}

const ReligionDropdown: React.FC<ReligionDropdownProps> = ({ form: { control } }) => {
    return (
        <Controller
            control={control}
            name="religion"
            render={({ field }) => (
                <SelectGroup>
                    <SelectLabel className="text-muted-foreground mb-1 text-sm">
                        Religion
                    </SelectLabel>
                    <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Religion" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hinduism">Hinduism</SelectItem>
                            <SelectItem value="islam">Islam</SelectItem>
                            <SelectItem value="christianity">Christianity</SelectItem>
                            <SelectItem value="sikhism">Sikhism</SelectItem>
                            <SelectItem value="buddhism">Buddhism</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="none">None / Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </SelectGroup>
            )}
        />
    )
}

export default ReligionDropdown
