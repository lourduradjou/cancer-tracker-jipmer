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
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import { Patient } from '@/types/patient'
import { format, isFuture } from 'date-fns'
import { toast } from 'sonner'

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

	const nameRef = useRef<HTMLInputElement>(null)

	const [formData, setFormData] = useState({
		name: '',
		phoneNumber: '',
		address: '',
		sex: '',
		rationCardColor: '',
		hospitalId: '',
		disease: '',
		aabhaId: '',
	})

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (open && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
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
				;(e.target.form.elements.namedItem(next) as HTMLInputElement).focus()
			}
		}
	}

	const clearForm = () => {
		setDob('')
		setAadhaar({ part1: '', part2: '', part3: '' })
		setFormData({
			name: '',
			phoneNumber: '',
			address: '',
			sex: '',
			rationCardColor: '',
			hospitalId: '',
			disease: '',
			aabhaId: '',
		})
		nameRef.current?.focus()
	}

	const handleAdd = async () => {
		const { name, phoneNumber, address, sex, rationCardColor, hospitalId, disease, aabhaId } = formData
		const aadhaarId = aadhaar.part1 + aadhaar.part2 + aadhaar.part3

		if (!name || !phoneNumber || !aadhaarId || !dob || !address || !sex || !rationCardColor || !hospitalId || !disease) {
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
				hospitalId,
				disease,
			}
			const docRef = await addDoc(collection(db, 'patients'), fullData)
			setPatients((prev) => [...prev, { id: docRef.id, ...fullData } as Patient])
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
				<Button className="bg-primary">
					<Plus className=" h-4 w-4" />
					Add Patient
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Patient</DialogTitle>
				</DialogHeader>

				<form className="grid gap-6 py-4" onSubmit={(e) => e.preventDefault()}>
					<div className="flex flex-col md:flex-row gap-6">
						{/* LEFT SIDE */}
						<div className="flex flex-col gap-4 md:w-1/2">
							<Input ref={nameRef} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
							<Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />

							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
								<div className="flex gap-2">
									<Input name="part1" placeholder="XXXX" value={aadhaar.part1} onChange={(e) => handleAadhaarChange(e, 'part1')} className="w-1/3" />
									<Input name="part2" placeholder="XXXX" value={aadhaar.part2} onChange={(e) => handleAadhaarChange(e, 'part2')} className="w-1/3" />
									<Input name="part3" placeholder="XXXX" value={aadhaar.part3} onChange={(e) => handleAadhaarChange(e, 'part3')} className="w-1/3" />
								</div>
							</div>

							<Input name="aabhaId" placeholder="AABHA ID (optional)" value={formData.aabhaId} onChange={handleChange} />
							<Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
						</div>

						{/* RIGHT SIDE */}
						<div className="flex flex-col gap-4 md:w-1/2">
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
								<input
									type="date"
									value={dob}
									max={format(new Date(), 'yyyy-MM-dd')}
									onChange={(e) => setDob(e.target.value)}
									className="w-full border rounded-md px-3 py-2 text-sm"
								/>
							</div>

							<Select onValueChange={(val) => setFormData((prev) => ({ ...prev, sex: val }))}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Sex" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">Female</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>

							<Select onValueChange={(val) => setFormData((prev) => ({ ...prev, disease: val }))}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Disease" />
								</SelectTrigger>
								<SelectContent>
									{DISEASES.map((d) => (
										<SelectItem key={d} value={d}>
											{d}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select onValueChange={(val) => setFormData((prev) => ({ ...prev, rationCardColor: val }))}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Ration Card Color" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="red">Red</SelectItem>
									<SelectItem value="yellow">Yellow</SelectItem>
									<SelectItem value="none">None</SelectItem>
								</SelectContent>
							</Select>

							<Select onValueChange={(val) => setFormData((prev) => ({ ...prev, hospitalId: val }))}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Hospital" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="jip-ig-1">JIPMER IG 1</SelectItem>
									<SelectItem value="gov-gen-hosp-2">Gov General Hospital 2</SelectItem>
									<SelectItem value="puducherry-phc-3">Puducherry PHC 3</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>

				<DialogFooter className="flex gap-2 justify-between">
					<Button variant="outline" onClick={clearForm} className="text-red-600 border-red-500 w-[20%]">
						<X className="h-4 w-4" />
						Clear
					</Button>
					<Button onClick={handleAdd} className="w-[80%]">
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
