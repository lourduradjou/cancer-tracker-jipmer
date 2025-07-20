'use client'

import { useEffect, useState } from 'react'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

type Hospital = {
	id: string
	name: string
	address: string
	contactNumber: string
}

export default function TransferDialog({
	patient,
	onTransfer,
}: {
	patient: any
	onTransfer: (hospitalId: string) => void
}) {
	const [hospitals, setHospitals] = useState<Hospital[]>([])
	const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
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
		.filter((h) =>
			h.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.slice(0, 3) // limit to top 3 matches

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='border-purple-500 text-purple-600 hover:bg-purple-50'
				>
					Transfer
				</Button>
			</DialogTrigger>
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
									onSelect={() => {
										setSelectedHospital(hospital)
										setSearchTerm(hospital.name) // optional UX: show selected
									}}
								>
									<div>
										<p className='font-medium'>{hospital.name}</p>
										<p className='text-sm text-muted-foreground'>
											{hospital.address}
										</p>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</Command>

					{selectedHospital && (
						<div className="text-sm mt-2 text-muted-foreground">
							Selected: <span className="font-medium">{selectedHospital.name}</span>
						</div>
					)}
				</div>

				<DialogFooter className='mt-4'>
					<Button onClick={handleTransfer} disabled={!selectedHospital}>
						Confirm Transfer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
