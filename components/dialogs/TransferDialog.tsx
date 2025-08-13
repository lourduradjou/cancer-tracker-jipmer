'use client'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { collection, getDocs } from 'firebase/firestore'
import { Repeat2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type Hospital = {
	id: string
	name: string
	address: string
	contactNumber: string
}

export default function TransferDialog({
	onTransfer,
}: {
	patient: Patient
	onTransfer: (hospitalId: string) => void
}) {
	const [hospitals, setHospitals] = useState<Hospital[]>([])
	const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
		null
	)
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		const fetchHospitals = async () => {
			try {
				const snapshot = await getDocs(collection(db, 'hospitals'))
				const hospitalList: Hospital[] = snapshot.docs.map((doc) => ({
					id: doc.id,
					...(doc.data() as Omit<Hospital, 'id'>),
				}))
				setHospitals(hospitalList)
			} catch (error) {
				console.error('Error fetching hospitals:', error)
			}
		}

		fetchHospitals()
	}, [])

	const handleTransfer = () => {
		if (selectedHospital) {
			onTransfer(selectedHospital.id)
		}
	}

	const filteredHospitals = hospitals
		.filter((h) => h.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.slice(0, 3) // limit to top 3 matches

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							size='icon'
							variant='outline'
							className='cursor-pointer'
						>
							<Repeat2 className='w-4 h-4' />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Transfer</TooltipContent>
			</Tooltip>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Transfer Patient</DialogTitle>
				</DialogHeader>

				<div className='space-y-2'>
					<Label>Select Hospital</Label>
					<Command className='rounded-md border shadow-md'>
						<CommandInput
							placeholder='Search hospital name...'
							onValueChange={(value) => setSearchTerm(value)}
						/>
						<CommandEmpty>No hospital found.</CommandEmpty>
						<CommandGroup>
							{filteredHospitals.map((hospital) => (
								<CommandItem
									key={hospital.id}
									onSelect={() =>
										setSelectedHospital(hospital)
									}
								>
									<div>
										<p className='font-medium'>
											{hospital.name}
										</p>
										<p className='text-sm text-muted-foreground'>
											{hospital.address}
										</p>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</div>

				<DialogFooter className='mt-4'>
					<Button
						onClick={handleTransfer}
						disabled={!selectedHospital}
					>
						Confirm Transfer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
