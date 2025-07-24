'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Keyboard, ListFilter, Search } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Props = {
	searchTerm: string
	setSearchTerm: (val: string) => void
	filterSexes: string[]
	setFilterSexes: (val: string[]) => void
	filterDiseases: string[]
	setFilterDiseases: (val: string[]) => void
	filterStatuses: string[]
	setFilterStatuses: (val: string[]) => void
	ageFilter: string | null
	setAgeFilter: (val: string | null) => void
	minAge: number | null
	setMinAge: (val: number | null) => void
	maxAge: number | null
	setMaxAge: (val: number | null) => void
	filterRationColors: string[]
	setFilterRationColors: (val: string[]) => void
}

const SEX_OPTIONS = ['male', 'female', 'other']
const DISEASE_OPTIONS = [
	'breast cancer',
	'lung cancer',
	'colorectal cancer',
	'prostate cancer',
	'stomach cancer',
	'cervical cancer',
	'thyroid cancer',
	'brain cancer',
	'oral cancer',
]
const STATUS = ['alive', 'death', 'ongoing', 'followup']
const RATION_COLORS = ['red', 'yellow', 'none']

export default function PatientFilter({
	searchTerm,
	setSearchTerm,
	filterSexes,
	setFilterSexes,
	filterDiseases,
	setFilterDiseases,
	filterStatuses,
	setFilterStatuses,
	ageFilter,
	setAgeFilter,
	minAge,
	setMinAge,
	maxAge,
	setMaxAge,
	filterRationColors,
	setFilterRationColors,
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
		<div className='flex flex-col md:flex-row md:items-center gap-4'>
			<div className='relative w-full md:w-[450px]'>
				<Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<Input
					ref={searchRef}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Search via name, aadhaar, aabha number (shortcut: Ctrl + K)'
					className='pl-8  w-full'
				/>
			</div>

			<Popover>
				<PopoverTrigger asChild>
					<Button className=' cursor-pointer ' variant='outline'>
						<ListFilter className='mr-1 h-4 w-4' />
						Filters
					</Button>
				</PopoverTrigger>

				<PopoverContent className='w-[600px] p-4'>
					<div className='flex flex-wrap gap-6'>

						{/* Sex Filter */}
						<div className='min-w-[150px]'>
							<Label className='text-sm font-medium'>Sex</Label>
							<div className='mt-2 space-y-1'>
								{SEX_OPTIONS.map((option) => (
									<div key={option} className='flex items-center space-x-2'>
										<Checkbox
											id={`sex-${option}`}
											checked={filterSexes.includes(option)}
											onCheckedChange={() =>
												toggleSelection(option, filterSexes, setFilterSexes)
											}
										/>
										<Label htmlFor={`sex-${option}`} className='capitalize'>
											{option}
										</Label>
									</div>
								))}
							</div>
						</div>

						{/* Disease Filter */}
						<div className='min-w-[180px]'>
							<Label className='text-sm font-medium'>Disease</Label>
							<div className='mt-2 space-y-1'>
								{DISEASE_OPTIONS.map((option) => (
									<div key={option} className='flex items-center space-x-2'>
										<Checkbox
											id={`disease-${option}`}
											checked={filterDiseases.includes(option)}
											onCheckedChange={() =>
												toggleSelection(option, filterDiseases, setFilterDiseases)
											}
										/>
										<Label htmlFor={`disease-${option}`} className='capitalize'>
											{option}
										</Label>
									</div>
								))}
							</div>
						</div>

						{/* Status Filter */}
						<div className='min-w-[150px]'>
							<Label className='text-sm font-medium'>Status</Label>
							<div className='mt-2 space-y-1'>
								{STATUS.map((option) => (
									<div key={option} className='flex items-center space-x-2'>
										<Checkbox
											id={`status-${option}`}
											checked={filterStatuses.includes(option)}
											onCheckedChange={() =>
												toggleSelection(option, filterStatuses, setFilterStatuses)
											}
										/>
										<Label htmlFor={`status-${option}`} className='capitalize'>
											{option}
										</Label>
									</div>
								))}
							</div>
						</div>

						{/* Age Filter */}
						<div className='min-w-[220px]'>
							<Label className='text-sm font-medium'>Age</Label>
							<div className='mt-2 space-y-1'>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='age-6mo'
										checked={ageFilter === '<6mo'}
										onCheckedChange={() =>
											setAgeFilter(ageFilter === '<6mo' ? null : '<6mo')
										}
									/>
									<Label htmlFor='age-6mo'>Less than 6 months</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='age-1yr'
										checked={ageFilter === '<1yr'}
										onCheckedChange={() =>
											setAgeFilter(ageFilter === '<1yr' ? null : '<1yr')
										}
									/>
									<Label htmlFor='age-1yr'>Less than 1 year</Label>
								</div>
								{/* <div className='flex items-center space-x-2'>
									<input
										type='number'
										placeholder='Min age'
										className='w-20 border rounded px-2 py-1 text-sm'
										value={minAge ?? ''}
										onChange={(e) =>
											setMinAge(e.target.value ? +e.target.value : null)
										}
									/>
									<span>to</span>
									<input
										type='number'
										placeholder='Max age'
										className='w-20 border rounded px-2 py-1 text-sm'
										value={maxAge ?? ''}
										onChange={(e) =>
											setMaxAge(e.target.value ? +e.target.value : null)
										}
									/>
								</div> */}
							</div>
						</div>

						{/* Ration Card Filter */}
						<div className='min-w-[150px]'>
							<Label className='text-sm font-medium'>Ration Card</Label>
							<div className='mt-2 space-y-1'>
								{RATION_COLORS.map((color) => (
									<div key={color} className='flex items-center space-x-2'>
										<Checkbox
											id={`ration-${color}`}
											checked={filterRationColors.includes(color)}
											onCheckedChange={() =>
												toggleSelection(color, filterRationColors, setFilterRationColors)
											}
										/>
										<Label htmlFor={`ration-${color}`} className='capitalize'>
											{color}
										</Label>
									</div>
								))}
							</div>
						</div>

					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
