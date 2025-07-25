'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { format, isFuture, subYears } from 'date-fns'
import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
	doc,
	updateDoc,
} from 'firebase/firestore'
import { ArrowRightCircle, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'

import { DISEASES } from '@/constants/data'
import PatientForm from './PatientForm'

export default function AddPatientDialog({
	setPatients,
}: {
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}) {
	// --- State Declarations ---
	const [open, setOpen] = useState(false)
	const [dob, setDob] = useState('')
	const [aadhaar, setAadhaar] = useState({ part1: '', part2: '', part3: '' })
	const [selectedDiseases, setSelectedDiseases] = useState<string[]>([])
	const [selectedPhc, setSelectedPhc] = useState('')
	const nameRef = useRef<HTMLInputElement>(null)
	const [useAgeInstead, setUseAgeInstead] = useState(false)
	const [ageInput, setAgeInput] = useState('')
	const [diagnosedDate, setDiagnosedDate] = useState('')
	const [diagnosedYearsAgo, setDiagnosedYearsAgo] = useState('')
	const [insuranceType, setInsuranceType] = useState<
		'none' | 'government' | 'private'
	>('none')
	const [insuranceId, setInsuranceId] = useState('')

	const [formData, setFormData] = useState({
		name: '',
		address: '',
		sex: '',
		rationCardColor: '',
		aabhaId: '',
		status: 'Alive',
	})

	const [rawPhoneNumbers, setRawPhoneNumbers] = useState<string[]>([''])
	const [hasAadhaar, setHasAadhaar] = useState<boolean>(true)
	const [aadhaarCheckTimer, setAadhaarCheckTimer] =
		useState<NodeJS.Timeout | null>(null)
	const [namePhoneCheckTimer, setNamePhoneCheckTimer] =
		useState<NodeJS.Timeout | null>(null)

	// --- Helper Functions (Memoized with useCallback) ---
	// Define functions in order of dependency.

	// 1. `clearForm` (most independent)
	const clearForm = useCallback(() => {
		setDob('')
		setAadhaar({ part1: '', part2: '', part3: '' })
		setSelectedDiseases([])
		setSelectedPhc('')
		setFormData({
			name: '',
			address: '',
			sex: '',
			rationCardColor: '',
			aabhaId: '',
			status: 'Alive',
		})
		setRawPhoneNumbers([''])
		setHasAadhaar(true)
		localStorage.removeItem('addPatientFormData')
		nameRef.current?.focus()
	}, [])

	// 2. `updatePatientAssignedPhc` (depends on `clearForm`, `setOpen`, `setPatients`, `selectedPhc`)
	const updatePatientAssignedPhc = useCallback(
		async (patientId: string, currentPhc: string) => {
			if (!patientId || !currentPhc) {
				toast.error(
					'Cannot transfer: missing patient ID or current PHC.'
				)
				return
			}

			try {
				const patientRef = doc(db, 'patients', patientId)
				await updateDoc(patientRef, {
					assignedPhc: currentPhc,
					transferred: true,
				})
				toast.success(
					'Patient record successfully transferred and updated!'
				)
				setOpen(false)
				clearForm()
			} catch (error) {
				console.error('Error updating patient for transfer:', error)
				toast.error('Failed to transfer patient. Please try again.')
			}
		},
		[selectedPhc, setOpen, clearForm, setPatients]
	)

	// 3. `checkAadhaarDuplicate` (depends on `updatePatientAssignedPhc`, `selectedPhc`)
	const checkAadhaarDuplicate = useCallback(
		async (
			aadhaarId: string,
			showToast: boolean = false
		): Promise<{ exists: boolean; patientId?: string }> => {
			if (!aadhaarId || aadhaarId.length !== 12) {
				return { exists: false }
			}
			const patientsRef = collection(db, 'patients')
			const q = query(patientsRef, where('aadhaarId', '==', aadhaarId))
			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				const patientId = querySnapshot.docs[0].id
				if (showToast) {
					toast.warning('Patient with this Aadhaar already exists.', {
						action: {
							label: (
								<span className='flex items-center text-blue-500'>
									<ArrowRightCircle className='h-4 w-4 mr-1' />{' '}
									Transfer
								</span>
							),
							onClick: () =>
								updatePatientAssignedPhc(
									patientId,
									selectedPhc
								),
						},
						duration: 5000,
					})
				}
				return { exists: true, patientId }
			}
			return { exists: false }
		},
		[updatePatientAssignedPhc, selectedPhc]
	)

	// 4. `checkNamePhoneDuplicate` (depends on `updatePatientAssignedPhc`, `selectedPhc`, `aadhaar`, `hasAadhaar`)
	const checkNamePhoneDuplicate = useCallback(
		async (
			name: string,
			phoneNumbers: string[],
			showToast: boolean = false
		): Promise<{ exists: boolean; patientId?: string }> => {
			if (!name.trim() || phoneNumbers.length === 0) {
				return { exists: false }
			}

			const patientsRef = collection(db, 'patients')
			const querySnapshot = await getDocs(patientsRef)

			const cleanedName = name.toLowerCase().trim()
			const cleanedPhoneNumbers = phoneNumbers
				.map((num) => num.replace(/\D/g, ''))
				.filter((num) => num.length === 10)

			let possibleMatchFound = false
			let matchedPatientId: string | undefined

			for (const doc of querySnapshot.docs) {
				const patient = doc.data() as Patient
				const patientName = patient.name.toLowerCase().trim()
				const patientPhoneNumbers = patient.phoneNumber || []

				const nameMatch =
					patientName.includes(cleanedName) ||
					cleanedName.includes(patientName) ||
					(cleanedName.length > 3 &&
						patientName.startsWith(
							cleanedName.substring(
								0,
								Math.floor(cleanedName.length * 0.9)
							)
						))

				const phoneMatch = cleanedPhoneNumbers.some((num) =>
					patientPhoneNumbers.includes(num)
				)

				const patientAadhaarId = patient.aadhaarId || ''
				const existingPatientHasAadhaar = patient.hasAadhaar ?? true

				const currentAadhaarId = hasAadhaar
					? aadhaar.part1 + aadhaar.part2 + aadhaar.part3
					: ''
				const aadhaarMatch =
					hasAadhaar &&
					existingPatientHasAadhaar &&
					patientAadhaarId === currentAadhaarId

				if (
					(nameMatch && phoneMatch) ||
					(aadhaarMatch && cleanedName.length > 0)
				) {
					possibleMatchFound = true
					matchedPatientId = doc.id
					break
				}
			}

			if (possibleMatchFound && matchedPatientId) {
				if (showToast) {
					toast.info(
						'Possible match found based on name and phone number. Ask if they already provided details.',
						{
							// action: {
							// 	label: (
							// 		<span className='flex items-center text-blue-500'>
							// 			<ArrowRightCircle className='h-4 w-4 mr-1' />{' '}
							// 			Transfer
							// 		</span>
							// 	),
							// 	onClick: () =>
							// 		updatePatientAssignedPhc(
							// 			matchedPatientId!,
							// 			selectedPhc
							// 		),
							// },
							duration: 5000,
						}
					)
				}
				return { exists: true, patientId: matchedPatientId }
			}
			return { exists: false }
		},
		[updatePatientAssignedPhc, selectedPhc, aadhaar, hasAadhaar]
	)

	const handleAdd = useCallback(async () => {
		const { name, address, sex, rationCardColor, aabhaId, status } =
			formData
		const age = ageInput

		let finalDiagnosedDate = diagnosedDate
		if (!diagnosedDate && diagnosedYearsAgo) {
			const approxDate = subYears(new Date(), Number(diagnosedYearsAgo))
			finalDiagnosedDate = format(approxDate, 'yyyy-MM-dd')
		}

		const aadhaarId = hasAadhaar
			? aadhaar.part1 + aadhaar.part2 + aadhaar.part3
			: ''

		const cleanedPhoneNumbers = rawPhoneNumbers
			.map((num) => num.replace(/\D/g, ''))
			.filter((num) => num.length > 0)

		// --- Validation Checks ---
		if (
			!name ||
			(useAgeInstead ? !age : !dob) || // ✅ Only one required
			!address ||
			!sex ||
			!rationCardColor ||
			!selectedPhc ||
			selectedDiseases.length === 0
		) {
			toast.error('Please fill all required fields.')
			console.log('⚠️ Validation failed due to:')
			console.log({
				name: !!name,
				dob: useAgeInstead ? '(skipped)' : !!dob,
				age: useAgeInstead ? !!age : '(skipped)',
				address: !!address,
				sex: !!sex,
				rationCardColor: !!rationCardColor,
				selectedPhc: !!selectedPhc,
				selectedDiseases: selectedDiseases.length > 0,
			})
			return
		}

		// ✅ Optional: Validate age if used
		if (useAgeInstead) {
			const ageNum = Number(age)
			if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
				toast.error('Please enter a valid age between 0 and 120.')
				return
			}
		}

		// ... rest of your validation

		const parsedDob = useAgeInstead
			? subYears(new Date(), Number(age)) // use age to calculate approximate DOB
			: new Date(dob)

		if (isNaN(parsedDob.getTime())) {
			toast.error('Invalid date of birth or age.')
			return
		}

		if (isFuture(parsedDob)) {
			toast.error('Date of birth cannot be in the future.')
			return
		}

		try {
			const fullData = {
				name,
				phoneNumber:
					cleanedPhoneNumbers.length > 0
						? cleanedPhoneNumbers
						: ['N/A'],
				aadhaarId: hasAadhaar ? aadhaarId : 'N/A',
				aabhaId,
				dob: format(parsedDob, 'dd-MM-yyyy'), // always derived
				address,
				sex,
				rationCardColor,
				assignedPhc: selectedPhc,
				diseases: selectedDiseases,
				status,
				hasAadhaar,
				transferred: false,
				diagnosedDate: finalDiagnosedDate || 'Unknown',
				insurance:
					insuranceType === 'none'
						? 'none'
						: {
								type: insuranceType,
								id: insuranceId || 'N/A',
						  },
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
	}, [
		formData,
		aadhaar,
		hasAadhaar,
		rawPhoneNumbers,
		dob,
		selectedPhc,
		selectedDiseases,
		clearForm,
		checkAadhaarDuplicate,
		checkNamePhoneDuplicate,
		setPatients,
		useAgeInstead, // ✅ add this
	])

	// --- useEffects ---
	// These useEffects must be declared *after* all the useCallback functions they depend on.

	// Load saved form data from localStorage
	useEffect(() => {
		if (open) {
			const saved = localStorage.getItem('addPatientFormData')
			if (saved) {
				try {
					const parsed = JSON.parse(saved)
					setFormData(parsed.formData || {})
					setRawPhoneNumbers(
						Array.isArray(parsed.rawPhoneNumbers) &&
							parsed.rawPhoneNumbers.length > 0
							? parsed.rawPhoneNumbers
							: ['']
					)
					setAadhaar(
						parsed.aadhaar || { part1: '', part2: '', part3: '' }
					)
					setDob(parsed.dob || '')
					setSelectedPhc(parsed.selectedPhc || '')
					setSelectedDiseases(parsed.selectedDiseases || [])
					setHasAadhaar(parsed.hasAadhaar ?? true)
				} catch (err) {
					console.warn('Failed to parse saved form data:', err)
				}
			}
		}
	}, [open])

	// Save to localStorage whenever any field changes
	useEffect(() => {
		const dataToSave = {
			formData,
			rawPhoneNumbers,
			aadhaar,
			dob,
			selectedPhc,
			selectedDiseases,
			hasAadhaar,
		}
		localStorage.setItem('addPatientFormData', JSON.stringify(dataToSave))
	}, [
		formData,
		rawPhoneNumbers,
		aadhaar,
		dob,
		selectedPhc,
		selectedDiseases,
		hasAadhaar,
	])

	// Filter diseases based on sex
	useEffect(() => {
		setSelectedDiseases((prev) =>
			prev.filter((disease) => {
				const allDiseases = [...DISEASES.solid, ...DISEASES.blood]
				const match = allDiseases.find((d) => d.label === disease)
				return !match?.gender || match.gender === formData.sex
			})
		)
	}, [formData.sex])

	// Keyboard shortcut to focus the name input
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

	// Effect for debouncing Aadhaar input check (REAL-TIME)
	useEffect(() => {
		if (hasAadhaar) {
			const fullAadhaar = aadhaar.part1 + aadhaar.part2 + aadhaar.part3
			if (fullAadhaar.length === 12) {
				if (aadhaarCheckTimer) {
					clearTimeout(aadhaarCheckTimer)
				}
				const timer = setTimeout(async () => {
					await checkAadhaarDuplicate(fullAadhaar, true)
				}, 500)
				setAadhaarCheckTimer(timer)
			}
		} else if (aadhaarCheckTimer) {
			clearTimeout(aadhaarCheckTimer)
		}
		return () => {
			if (aadhaarCheckTimer) {
				clearTimeout(aadhaarCheckTimer)
				// No need to set setAadhaarCheckTimer(null) here, as useState manages it
				// We clear the timeout, but the state will naturally update on next render
				// if the timer ID changes.
			}
		}
	}, [
		aadhaar.part1,
		aadhaar.part2,
		aadhaar.part3,
		hasAadhaar,
		checkAadhaarDuplicate,
	]) // Removed aadhaarCheckTimer from dependencies

	// New Effect for debouncing Name/Phone fuzzy check (REAL-TIME for 'No Aadhaar' patients)
	useEffect(() => {
		if (!hasAadhaar) {
			const cleanedPhoneNumbers = rawPhoneNumbers
				.map((num) => num.replace(/\D/g, ''))
				.filter((num) => num.length > 0)
			const trimmedName = formData.name.trim()

			if (
				trimmedName.length > 0 &&
				cleanedPhoneNumbers.some((num) => /^\d{10}$/.test(num))
			) {
				if (namePhoneCheckTimer) {
					clearTimeout(namePhoneCheckTimer)
				}
				const timer = setTimeout(async () => {
					await checkNamePhoneDuplicate(
						trimmedName,
						cleanedPhoneNumbers,
						true
					)
				}, 700)
				setNamePhoneCheckTimer(timer)
			}
		} else if (namePhoneCheckTimer) {
			clearTimeout(namePhoneCheckTimer)
		}
		return () => {
			if (namePhoneCheckTimer) {
				clearTimeout(namePhoneCheckTimer)
				// No need to set setNamePhoneCheckTimer(null) here either.
			}
		}
	}, [hasAadhaar, formData.name, rawPhoneNumbers, checkNamePhoneDuplicate]) // Removed namePhoneCheckTimer from dependencies

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='!border-green-400 border-2 cursor-pointer'
				>
					<Plus className='h-4 w-4' />
					Add Patient
				</Button>
			</DialogTrigger>

			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				className='min-w-[1000px]'
			>
				<DialogHeader>
					<DialogTitle className='select-none'>
						Add New Patient
					</DialogTitle>
				</DialogHeader>

				<PatientForm
					formData={formData}
					setFormData={setFormData}
					rawPhoneNumbers={rawPhoneNumbers}
					setRawPhoneNumbers={setRawPhoneNumbers}
					aadhaar={aadhaar}
					setAadhaar={setAadhaar}
					dob={dob}
					setDob={setDob}
					selectedDiseases={selectedDiseases}
					setSelectedDiseases={setSelectedDiseases}
					selectedPhc={selectedPhc}
					setSelectedPhc={setSelectedPhc}
					nameRef={nameRef}
					hasAadhaar={hasAadhaar}
					setHasAadhaar={setHasAadhaar}
					useAgeInstead={useAgeInstead}
					setUseAgeInstead={setUseAgeInstead}
					ageInput={ageInput}
					setAgeInput={setAgeInput}
					diagnosedDate={diagnosedDate}
					setDiagnosedDate={setDiagnosedDate}
					diagnosedYearsAgo={diagnosedYearsAgo}
					setDiagnosedYearsAgo={setDiagnosedYearsAgo}
					insuranceType={insuranceType}
					setInsuranceType={setInsuranceType}
					insuranceId={insuranceId}
					setInsuranceId={setInsuranceId}
				/>

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
