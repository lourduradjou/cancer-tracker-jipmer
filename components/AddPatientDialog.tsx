'use client'

import { useEffect, useRef, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
import { Patient } from '@/types/patient'
import { format, isFuture } from 'date-fns'
import { toast } from 'sonner'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

const DISEASES = [
	'breast cancer',
	'lung cancer',
	'colorectal cancer',
	'prostate cancer',
	'stomach cancer',
	'cervical cancer',
	'thyroid cancer',
	'brain cancer',
]

export default function AddPatientDialog({
	setPatients,
}: {
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}) {
	const [open, setOpen] = useState(false)
	const [dob, setDob] = useState('')
	const [aadhaar, setAadhaar] = useState({ part1: '', part2: '', part3: '' })
	const [selectedDiseases, setSelectedDiseases] = useState<string[]>([])
	const [selectedPhc, setSelectedPhc] = useState('')
	const nameRef = useRef<HTMLInputElement>(null)

	const [formData, setFormData] = useState({
		name: '',
		phoneNumber: '',
		address: '',
		sex: '',
		rationCardColor: '',
		aabhaId: '',
	})

	const [rawPhoneNumber, setRawPhoneNumber] = useState('')

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (
				open &&
				(e.ctrlKey || e.metaKey) &&
				e.key.toLowerCase() === 'a'
			) {
				e.preventDefault()
				nameRef.current?.focus()
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [open])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleAadhaarChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		part: 'part1' | 'part2' | 'part3'
	) => {
		let value = e.target.value.replace(/\D/g, '').slice(0, 4)
		setAadhaar((prev) => ({ ...prev, [part]: value }))

		if (value.length === 4) {
			const next = { part1: 'part2', part2: 'part3', part3: '' }[part]
			if (next && e.target.form?.elements.namedItem(next)) {
				;(
					e.target.form.elements.namedItem(next) as HTMLInputElement
				).focus()
			}
		}
	}

	const clearForm = () => {
		setDob('')
		setAadhaar({ part1: '', part2: '', part3: '' })
		setSelectedDiseases([])
		setSelectedPhc('')
		setFormData({
			name: '',
			phoneNumber: '',
			address: '',
			sex: '',
			rationCardColor: '',
			aabhaId: '',
		})
		setRawPhoneNumber('')
		nameRef.current?.focus()
	}

	const handleAdd = async () => {
		const { name, address, sex, rationCardColor, aabhaId } = formData
		const phoneNumber = rawPhoneNumber.replace(/\D/g, '') // remove dashes
		const aadhaarId = aadhaar.part1 + aadhaar.part2 + aadhaar.part3

		if (
			!name ||
			!phoneNumber ||
			!aadhaarId ||
			!dob ||
			!address ||
			!sex ||
			!rationCardColor ||
			!selectedPhc ||
			selectedDiseases.length === 0
		) {
			toast.error('Please fill all required fields.')
			return
		}

		if (!/^\d{10}$/.test(phoneNumber)) {
			toast.error('Phone number must be exactly 10 digits.')
			return
		}

		if (!/^\d{12}$/.test(aadhaarId)) {
			toast.error('Aadhaar must be exactly 12 digits.')
			return
		}

		const parsedDob = new Date(dob)
		if (isNaN(parsedDob.getTime())) {
			toast.error('Invalid date of birth.')
			return
		}

		if (isFuture(parsedDob)) {
			toast.error('Date of birth cannot be in the future.')
			return
		}

		try {
			const fullData = {
				name,
				phoneNumber,
				aadhaarId,
				aabhaId,
				dob: format(parsedDob, 'dd-MM-yyyy'),
				address,
				sex,
				rationCardColor,
				assignedPhc: selectedPhc,
				diseases: selectedDiseases,
			}
			const docRef = await addDoc(collection(db, 'patients'), fullData)
			setPatients((prev) => [
				...prev,
				{ id: docRef.id, ...fullData } as Patient,
			])
			toast.success('Patient added successfully.')
			setOpen(false)
			clearForm()
		} catch (error) {
			console.error('Error adding patient:', error)
			toast.error('Failed to add patient. Please try again.')
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='bg-primary'>
					<Plus className=' h-4 w-4' />
					Add Patient
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Patient</DialogTitle>
				</DialogHeader>

				<form
					className='grid gap-6 py-4'
					onSubmit={(e) => e.preventDefault()}
				>
					<div className='flex flex-col md:flex-row gap-6'>
						<div className='flex flex-col gap-4 md:w-1/2'>
							<Input
								ref={nameRef}
								name='name'
								placeholder='Full Name'
								value={formData.name}
								onChange={handleChange}
							/>
							<Input
								name='phoneNumber'
								placeholder='Phone Number (e.g. 1234-5678-90)'
								value={rawPhoneNumber}
								onChange={(e) => {
									let val = e.target.value.replace(/\D/g, '')
									if (val.length > 10) val = val.slice(0, 10)
									let formatted = val.replace(
										/^(\d{4})(\d{0,4})(\d{0,2})$/,
										(_, g1, g2, g3) =>
											[g1, g2, g3]
												.filter(Boolean)
												.join('-')
									)
									setRawPhoneNumber(formatted)
								}}
							/>

							<div className='flex flex-col gap-1'>
								<label className='text-sm font-medium text-muted-foreground'>
									Aadhaar Number
								</label>
								<div className='flex gap-2'>
									{(['part1', 'part2', 'part3'] as const).map(
										(part) => (
											<Input
												key={part}
												name={part}
												placeholder='XXXX'
												value={aadhaar[part]}
												onChange={(e) =>
													handleAadhaarChange(e, part)
												}
												className='w-1/3'
											/>
										)
									)}
								</div>
							</div>

							<Input
								name='aabhaId'
								placeholder='AABHA ID (optional)'
								value={formData.aabhaId}
								onChange={handleChange}
							/>
							<Input
								name='address'
								placeholder='Address'
								value={formData.address}
								onChange={handleChange}
							/>
						</div>

						<div className='flex flex-col gap-4 md:w-1/2'>
							<div className='flex flex-col gap-1'>
								<label className='text-sm font-medium text-muted-foreground'>
									Date of Birth
								</label>
								<input
									type='date'
									value={dob}
									max={format(new Date(), 'yyyy-MM-dd')}
									onChange={(e) => setDob(e.target.value)}
									className='w-full border rounded-md px-3 py-2 text-sm'
								/>
							</div>

							{/* Sex */}
							<Select
								onValueChange={(val) =>
									setFormData((p) => ({ ...p, sex: val }))
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select Sex' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='male'>Male</SelectItem>
									<SelectItem value='female'>
										Female
									</SelectItem>
									<SelectItem value='other'>Other</SelectItem>
								</SelectContent>
							</Select>

							{/* Diseases Multi-Select */}
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										className={cn('w-full justify-start', {
											'text-muted-foreground':
												selectedDiseases.length === 0,
										})}
									>
										<div className='overflow-x-auto whitespace-nowrap w-full no-scrollbar'>
											{selectedDiseases.length > 0
												? selectedDiseases.join(', ')
												: 'Select Diseases'}
										</div>
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-full'>
									<div className='grid gap-2'>
										{DISEASES.map((disease) => (
											<label
												key={disease}
												className='flex items-center gap-2 cursor-pointer'
											>
												<Checkbox
													checked={selectedDiseases.includes(
														disease
													)}
													onCheckedChange={(
														checked
													) => {
														setSelectedDiseases(
															(prev) =>
																checked
																	? [
																			...prev,
																			disease,
																	  ]
																	: prev.filter(
																			(
																				d
																			) =>
																				d !==
																				disease
																	  )
														)
													}}
												/>
												<span className='text-sm'>
													{disease}
												</span>
											</label>
										))}
									</div>
								</PopoverContent>
							</Popover>

							<Select
								onValueChange={(val) =>
									setFormData((p) => ({
										...p,
										rationCardColor: val,
									}))
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Ration Card Color' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='red'>Red</SelectItem>
									<SelectItem value='yellow'>
										Yellow
									</SelectItem>
									<SelectItem value='none'>None</SelectItem>
								</SelectContent>
							</Select>

							<Select
								onValueChange={(val) => setSelectedPhc(val)}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select Hospital' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='jip-ig-1'>
										JIPMER IG 1
									</SelectItem>
									<SelectItem value='gov-gen-hosp-2'>
										Gov General Hospital 2
									</SelectItem>
									<SelectItem value='puducherry-phc-3'>
										Puducherry PHC 3
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>

				<DialogFooter className='flex gap-2 justify-between'>
					<Button
						variant='outline'
						onClick={clearForm}
						className='text-red-600 border-red-500 w-[20%]'
					>
						<X className='h-4 w-4' />
						Clear
					</Button>
					<Button onClick={handleAdd} className='w-[80%]'>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
