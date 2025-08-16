import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'

interface InsuranceInfoProps {
    form: UseFormReturn<PatientFormInputs>
}

export default function InsuranceInfo({ form }: InsuranceInfoProps) {
    const insuranceType = form.watch('insurance.type') || 'none'
    const insuranceId = form.watch('insurance.id') || ''

    return (
        <div className="space-y-4">
            <div>
                <Select
                    value={insuranceType}
                    onValueChange={(val) =>
                        form.setValue('insurance.type', val as 'none' | 'private' | 'government')
                    }
                >
                    <SelectTrigger className="text-muted-foreground w-full text-sm font-medium">
                        <SelectValue className="text-sm capitalize">
                            {insuranceType === 'none'
                                ? 'Insurance Type (default: none)'
                                : insuranceType}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {insuranceType !== 'none' && (
                <div className="animate-fadeIn space-y-2 opacity-0 transition-opacity duration-300 ease-in-out">
                    <Label
                        htmlFor="insurance-id"
                        className="text-muted-foreground text-sm font-medium"
                    >
                        Insurance ID / Policy Number
                    </Label>
                    <Input
                        id="insurance-id"
                        type="text"
                        placeholder="Enter insurance ID"
                        className="w-full"
                        value={insuranceId}
                        onChange={(e) => form.setValue('insurance.id', e.target.value)}
                    />
                </div>
            )}
        </div>
    )
}
