import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface InsuranceInfoProps {
	insuranceType: 'none' | 'private' | 'government'
	setInsuranceType: (value: 'none' | 'private' | 'government') => void
	insuranceId: string
	setInsuranceId: (value: string) => void
}

export default function InsuranceInfo({
	insuranceType,
	setInsuranceType,
	insuranceId,
	setInsuranceId,
}: InsuranceInfoProps) {
	return (
		<div className='space-y-4'>
			<div>
				<Select onValueChange={setInsuranceType} value={insuranceType}>
					<SelectTrigger className='w-full text-sm font-medium text-muted-foreground'>
						<SelectValue className='text-sm'>
							{insuranceType === 'none'
								? 'Insurance Type'
								: capitalize(insuranceType)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='none'>None</SelectItem>
						<SelectItem value='private'>Private</SelectItem>
						<SelectItem value='government'>Government</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{insuranceType !== 'none' && (
				<div className='transition-opacity duration-300 ease-in-out opacity-0 animate-fadeIn space-y-2'>
					<Label
						htmlFor='insurance-id'
						className='text-sm font-medium text-muted-foreground'
					>
						Insurance ID / Policy Number
					</Label>
					<Input
						id='insurance-id'
						type='text'
						placeholder='Enter insurance ID'
						className='w-full'
						value={insuranceId}
						onChange={(e) => setInsuranceId(e.target.value)}
					/>
				</div>
			)}
		</div>
	)
}

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
