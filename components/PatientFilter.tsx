'use client'

import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ListFilter, Keyboard } from 'lucide-react'

type Props = {
	searchTerm: string
	setSearchTerm: (val: string) => void
	filterSexes: string[]
	setFilterSexes: (val: string[]) => void
	filterDiseases: string[]
	setFilterDiseases: (val: string[]) => void
}

const SEX_OPTIONS = ['male', 'female', 'other']
const DISEASE_OPTIONS = ['breast cancer', 'brain cancer', 'heart disease']

export default function PatientFilter({
	searchTerm,
	setSearchTerm,
	filterSexes,
	setFilterSexes,
	filterDiseases,
	setFilterDiseases,
}: Props) {
	const searchRef = useRef<HTMLInputElement>(null)

	const toggleSelection = (
		val: string,
		list: string[],
		setList: (v: string[]) => void
	) => {
		if (list.includes(val)) {
			setList(list.filter((item) => item !== val))
		} else {
			setList([...list, val])
		}
	}

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				searchRef.current?.focus()
			}
		}
		window.addEventListener('keydown', handleKey)
		return () => window.removeEventListener('keydown', handleKey)
	}, [])

	return (
		<div className="flex flex-col md:flex-row md:items-center gap-4">
			<div className="relative w-full md:w-[450px]">
				<Keyboard className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					ref={searchRef}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search via name, aadhaar, aabha number (shortcut: Ctrl + K)"
					className="pl-8 bg-sidebar w-full"
				/>
			</div>

			<Popover>
				<PopoverTrigger asChild>
					<Button className='bg-amber-500 cursor-pointer hover:bg-amber-600'>
						<ListFilter className="mr-2 h-4 w-4" />
						Filters
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-64 space-y-4">
					<div>
						<Label className="text-sm font-medium">Sex</Label>
						<div className="mt-2 space-y-1">
							{SEX_OPTIONS.map((option) => (
								<div key={option} className="flex items-center space-x-2">
									<Checkbox
										id={`sex-${option}`}
										checked={filterSexes.includes(option)}
										onCheckedChange={() =>
											toggleSelection(option, filterSexes, setFilterSexes)
										}
									/>
									<Label htmlFor={`sex-${option}`} className="capitalize">
										{option}
									</Label>
								</div>
							))}
						</div>
					</div>

					<div>
						<Label className="text-sm font-medium">Disease</Label>
						<div className="mt-2 space-y-1">
							{DISEASE_OPTIONS.map((option) => (
								<div key={option} className="flex items-center space-x-2">
									<Checkbox
										id={`disease-${option}`}
										checked={filterDiseases.includes(option)}
										onCheckedChange={() =>
											toggleSelection(option, filterDiseases, setFilterDiseases)
										}
									/>
									<Label htmlFor={`disease-${option}`} className="capitalize">
										{option}
									</Label>
								</div>
							))}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
