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
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { Plus, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { AVAILABLE_DISEASES_LIST } from '@/constants/data'
import PatientForm from './PatientForm'
import { checkAadhaarDuplicateUtil } from '@/lib/patient/checkPatientRecord'

/*
    *this component provides a dialog to get the patients details
    *optional data - aadhaar id, aabha id,
    *required data - sex, age/dob, diagnonized date, name,

    *actual form comes from the patientform component


*/

export default function AddPatientDialog() {
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
    const [insuranceType, setInsuranceType] = useState<'none' | 'government' | 'private'>('none')
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
    const aadhaarCheckTimer = useRef<NodeJS.Timeout | null>(null)
    const namePhoneCheckTimer = useRef<NodeJS.Timeout | null>(null)

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
    	[setOpen, clearForm]
    )

    const checkAadhaarDuplicate = useCallback(
        (aadhaarId: number): any => checkAadhaarDuplicateUtil(String(aadhaarId)),
        []
    )

    const checkNamePhoneDuplicate = useCallback(
        (name: string, phoneNumbers: string[]): string =>
            checkNamePhoneDuplicate(name, phoneNumbers),
        [aadhaar, hasAadhaar]
    )

    const handleAdd = useCallback(async () => {
        const { name, address, sex, rationCardColor, aabhaId, status } = formData
        const age = ageInput

        let finalDiagnosedDate = diagnosedDate
        if (!diagnosedDate && diagnosedYearsAgo) {
            const approxDate = subYears(new Date(), Number(diagnosedYearsAgo))
            finalDiagnosedDate = format(approxDate, 'yyyy-MM-dd')
        }

        const aadhaarId = hasAadhaar ? aadhaar.part1 + aadhaar.part2 + aadhaar.part3 : ''

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

        if (useAgeInstead) {
            const ageNum = Number(age)
            if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
                toast.error('Please enter a valid age between 0 and 120.')
                return
            }
        }

        const parsedDob = useAgeInstead
            ? subYears(new Date(), Number(age))
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
                phoneNumber: cleanedPhoneNumbers.length > 0 ? cleanedPhoneNumbers : ['N/A'],
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
            // setPatients((prev) => [...prev, { id: docRef.id, ...fullData } as Patient])
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
        // setPatients,
        useAgeInstead, // ✅ add this
        ageInput,
        diagnosedDate,
        diagnosedYearsAgo,
        insuranceType,
        insuranceId,
    ])

    // Load saved form data from localStorage if they skipped to finish the submission in the middle
    useEffect(() => {
        if (open) {
            const addPatientFormData = localStorage.getItem('addPatientFormData')
            if (addPatientFormData) {
                try {
                    const parsed = JSON.parse(addPatientFormData)
                    setFormData(parsed.formData || {})
                    setRawPhoneNumbers(
                        Array.isArray(parsed.rawPhoneNumbers) && parsed.rawPhoneNumbers.length > 0
                            ? parsed.rawPhoneNumbers
                            : ['']
                    )
                    setAadhaar(parsed.aadhaar || { part1: '', part2: '', part3: '' })
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
    }, [formData, rawPhoneNumbers, aadhaar, dob, selectedPhc, selectedDiseases, hasAadhaar])

    // Filter diseases based on sex
    useEffect(() => {
        setSelectedDiseases((prev) =>
            prev.filter((disease) => {
                const allDiseases = [
                    ...AVAILABLE_DISEASES_LIST.solid,
                    ...AVAILABLE_DISEASES_LIST.blood,
                ]
                const match = allDiseases.find((d) => d.label === disease)
                return !match?.gender || match.gender === formData.sex
            })
        )
    }, [formData.sex])

    // Keyboard shortcut to focus the name input
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

    // Effect for debouncing Aadhaar input check (REAL-TIME)
    useEffect(() => {
        if (hasAadhaar) {
            const fullAadhaar = aadhaar.part1 + aadhaar.part2 + aadhaar.part3
            if (fullAadhaar.length === 12) {
                if (aadhaarCheckTimer) {
                    clearTimeout(aadhaarCheckTimer.current)
                }
                const timer = setTimeout(async () => {
                    await checkAadhaarDuplicate(fullAadhaar)
                }, 500)
                aadhaarCheckTimer.current = timer
            }
        } else if (aadhaarCheckTimer) {
            clearTimeout(aadhaarCheckTimer.current)
        }
        return () => {
            if (aadhaarCheckTimer) {
                clearTimeout(aadhaarCheckTimer.current)
            }
        }
    }, [
        aadhaar.part1,
        aadhaar.part2,
        aadhaar.part3,
        hasAadhaar,
        checkAadhaarDuplicate,
        aadhaarCheckTimer,
    ])

    // New Effect for debouncing Name/Phone fuzzy check (REAL-TIME for 'No Aadhaar' patients)
    useEffect(() => {
        if (!hasAadhaar) {
            const cleanedPhoneNumbers = rawPhoneNumbers
                .map((num) => num.replace(/\D/g, ''))
                .filter((num) => num.length > 0)
            const trimmedName = formData.name.trim()

            if (trimmedName.length > 0 && cleanedPhoneNumbers.some((num) => /^\d{10}$/.test(num))) {
                if (namePhoneCheckTimer) {
                    clearTimeout(namePhoneCheckTimer.current)
                }
                const timer = setTimeout(async () => {
                    await checkNamePhoneDuplicate(trimmedName, cleanedPhoneNumbers, true)
                }, 700)
                namePhoneCheckTimer.current = timer
            }
        } else if (namePhoneCheckTimer) {
            clearTimeout(namePhoneCheckTimer.current)
        }
        return () => {
            if (namePhoneCheckTimer) {
                clearTimeout(namePhoneCheckTimer.current)
                // No need to set setNamePhoneCheckTimer(null) here either.
            }
        }
    }, [hasAadhaar, formData.name, rawPhoneNumbers, checkNamePhoneDuplicate, namePhoneCheckTimer]) // Removed namePhoneCheckTimer from dependencies

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer border-2 !border-green-400">
                    <Plus className="h-4 w-4" />
                    Add Patient
                </Button>
            </DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="min-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="select-none">Add New Patient Details</DialogTitle>
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

                <DialogFooter className="flex justify-between gap-2">
                    <Button
                        variant="outline"
                        onClick={clearForm}
                        className="h-12 w-[20%] border-red-500 text-red-600"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                    <Button onClick={handleAdd} className="h-12 w-[80%]">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
