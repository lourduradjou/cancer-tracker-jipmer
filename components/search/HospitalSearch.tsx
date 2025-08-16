'use client'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { db } from '@/firebase'
import { cn } from '@/lib/utils'
import { collection, getDocs } from 'firebase/firestore'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

/*
    todo:
        1) make this component debounce search value instead of getting all hospitals once  when the component mounts.
    todo:
        2) stop fetching all the hospitals initially to cut api call's and only search when they type it.
*/

// Define the shape of a hospital object
type Hospital = {
    id: string
    name: string
    address: string
}

interface HospitalOption {
    id: string
    name: string
}

// Define the props for our new component
interface HospitalSearchProps {
    value: HospitalOption // The currently selected hospital ID
    onValueChange: (value: HospitalOption) => void // Function to call when a hospital is selected
}

export default function HospitalSearch({ value, onValueChange }: HospitalSearchProps) {
    const [hospitals, setHospitals] = useState<Hospital[]>([])
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch hospitals from Firestore when the component mounts
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

    // Filter hospitals based on the search term for the name and address of the hospital, showing top 5 matches
    const lowerCasedSearchTerm = searchTerm.toLowerCase()
    const filteredHospitals = hospitals
        .filter(
            (hospital) =>
                hospital.name.toLowerCase().includes(lowerCasedSearchTerm) ||
                hospital.address.toLowerCase().includes(lowerCasedSearchTerm)
        )
        .slice(0, 5)

    const selectedHospitalName =
        hospitals.find((hospital) => hospital.id === value.id)?.name || 'Select Hospital...'

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="truncate">{selectedHospitalName}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search hospital..."
                        onValueChange={(search) => setSearchTerm(search)}
                    />
                    <CommandEmpty>No hospital found.</CommandEmpty>
                    <CommandGroup>
                        {filteredHospitals.map((hospital) => (
                            <CommandItem
                                key={hospital.id}
                                value={hospital.name} // Command uses this for internal filtering/search
                                onSelect={() => {
                                    onValueChange({
                                        id: hospital.id,
                                        name: hospital.name,
                                    })
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value?.id === hospital.id ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                                <div>
                                    <p className="font-medium">{hospital.name}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {hospital.address}
                                    </p>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
