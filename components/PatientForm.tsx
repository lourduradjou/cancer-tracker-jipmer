'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DISEASES } from '@/constants/data'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { MinusCircle, PlusCircle } from 'lucide-react'
import React from 'react'
import HospitalSearch from './HospitalSearch' // 1. Import the new component
import InsuranceInfo from './InsuranceInfo'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

// Define the types for the props
interface FormData {
	name: string
	address: string
	sex: string // This is crucial for filtering diseases
	rationCardColor: string
	aabhaId: string
	status: string
}

interface Aadhaar {
	part1: string
	part2: string
	part3: string
}

interface PatientFormProps {
	formData: FormData
	setFormData: React.Dispatch<React.SetStateAction<FormData>>
	rawPhoneNumbers: string[]
	setRawPhoneNumbers: React.Dispatch<React.SetStateAction<string[]>>
	aadhaar: Aadhaar
	setAadhaar: React.Dispatch<React.SetStateAction<Aadhaar>>
	dob: string
	setDob: React.Dispatch<React.SetStateAction<string>>
	selectedDiseases: string[]
	setSelectedDiseases: React.Dispatch<React.SetStateAction<string[]>>
	selectedPhc: string
	setSelectedPhc: React.Dispatch<React.SetStateAction<string>>
	nameRef: React.RefObject<HTMLInputElement | null>
	hasAadhaar: boolean
	setHasAadhaar: React.Dispatch<React.SetStateAction<boolean>>
	useAgeInstead: boolean
	setUseAgeInstead: React.Dispatch<React.SetStateAction<boolean>>
	ageInput: string
	setAgeInput: React.Dispatch<React.SetStateAction<string>>
	diagnosedDate: string
	setDiagnosedDate: React.Dispatch<React.SetStateAction<string>>
	diagnosedYearsAgo: string
	setDiagnosedYearsAgo: React.Dispatch<React.SetStateAction<string>>
	insuranceType: 'none' | 'government' | 'private'
	setInsuranceType: React.Dispatch<
		React.SetStateAction<'none' | 'government' | 'private'>
	>
	insuranceId: string
	setInsuranceId: React.Dispatch<React.SetStateAction<string>>
}

const MAX_PHONE_NUMBERS = 10

export default function PatientForm({
	formData,
	setFormData,
	rawPhoneNumbers,
	setRawPhoneNumbers,
	aadhaar,
	setAadhaar,
	dob,
	setDob,
	selectedDiseases,
	setSelectedDiseases,
	selectedPhc,
	setSelectedPhc,
	nameRef,
	hasAadhaar,
	setHasAadhaar,
	useAgeInstead,
	setUseAgeInstead,
	ageInput,
	setAgeInput,
	diagnosedDate,
	diagnosedYearsAgo,
	setDiagnosedDate,
	setDiagnosedYearsAgo,
	insuranceId,
	setInsuranceId,
	insuranceType,
	setInsuranceType,
}: PatientFormProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleAadhaarChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		part: 'part1' | 'part2' | 'part3'
	) => {
		const value = e.target.value.replace(/\D/g, '').slice(0, 4)
		setAadhaar((prev) => ({ ...prev, [part]: value }))

		if (value.length === 4) {
			const currentInput = e.target
			const nextInput =
				currentInput.nextElementSibling as HTMLInputElement | null
			if (nextInput && nextInput.tagName === 'INPUT') {
				nextInput.focus()
			} else if (
				part === 'part2' &&
				currentInput.form?.elements.namedItem('part3')
			) {
				;(
					currentInput.form.elements.namedItem(
						'part3'
					) as HTMLInputElement
				).focus()
			}
		}
	}

	const handlePhoneNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		let val = e.target.value.replace(/\D/g, '')
		if (val.length > 10) val = val.slice(0, 10)

		let formatted = val
		if (val.length > 4 && val.length <= 8) {
			formatted = `${val.slice(0, 4)}-${val.slice(4)}`
		} else if (val.length > 8) {
			formatted = `${val.slice(0, 4)}-${val.slice(4, 8)}-${val.slice(8)}`
		}

		setRawPhoneNumbers((prev) => {
			const newNumbers = [...prev]
			newNumbers[index] = formatted
			return newNumbers
		})
	}

	const addPhoneNumberField = () => {
		if (rawPhoneNumbers.length < MAX_PHONE_NUMBERS) {
			setRawPhoneNumbers((prev) => [...prev, ''])
		}
	}

	const removePhoneNumberField = (index: number) => {
		setRawPhoneNumbers((prev) => prev.filter((_, i) => i !== index))
	}

	return (
		<form
			className='grid gap-6 py-4 min-w-full select-none'
			onSubmit={(e) => e.preventDefault()}
			autoComplete='off'
		>
			<div className='flex flex-col md:flex-row gap-6 w-full'>
				<div className='flex flex-col gap-4 md:w-1/3 border-r-2'>
					<Input
						ref={nameRef}
						name='name'
						placeholder='Full Name'
						value={formData.name}
						onChange={handleChange}
						autoComplete='off'
						aria-autocomplete='none'
						required
						pattern='^[A-Za-z\s]+$'
						title='Only alphabets and spaces are allowed'
					/>
					{/* "No Aadhaar" Checkbox */}
					<div className='flex items-center space-x-2 mt-2'>
						<Checkbox
							id='noAadhaar'
							checked={!hasAadhaar}
							onCheckedChange={(checked) =>
								setHasAadhaar(!checked)
							}
						/>
						<label
							htmlFor='noAadhaar'
							className='text-sm text-muted-foreground'
						>
							No Aadhaar
						</label>
					</div>
					{/* Aadhaar Number Inputs (Conditionally Enabled) */}
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
										placeholder='_ _ _ _'
										value={aadhaar[part]}
										onChange={(e) =>
											handleAadhaarChange(e, part)
										}
										className='w-2/3 text-center text-lg'
										maxLength={4}
										disabled={!hasAadhaar}
										autoComplete='off'
									/>
								)
							)}
						</div>
					</div>

					{/* Dynamic Phone Number Inputs */}
					<div className='flex flex-col gap-2'>
						<label className='text-sm font-medium text-muted-foreground'>
							Phone Numbers (Max {MAX_PHONE_NUMBERS})
						</label>
						{rawPhoneNumbers.map((num, index) => (
							<div
								key={index}
								className='flex items-center gap-2'
							>
								<Input
									name={`phoneNumber-${index}`}
									placeholder='Phone Number (e.g. 1234-5678-90)'
									value={num}
									onChange={(e) =>
										handlePhoneNumberChange(e, index)
									}
									className='flex-grow'
									autoComplete='off'
								/>
								{rawPhoneNumbers.length > 1 && (
									<Button
										type='button'
										variant='ghost'
										size='icon'
										onClick={() =>
											removePhoneNumberField(index)
										}
										className='text-red-500 hover:text-red-700'
									>
										<MinusCircle className='h-4 w-4' />
									</Button>
								)}
							</div>
						))}
						{rawPhoneNumbers.length < MAX_PHONE_NUMBERS && (
							<Button
								type='button'
								variant='outline'
								onClick={addPhoneNumberField}
								className='w-full mt-2'
							>
								<PlusCircle className='h-4 w-4 mr-2' /> Add
								Phone Number
							</Button>
						)}
					</div>

					<Input
						name='aabhaId'
						placeholder='AABHA ID (optional)'
						value={formData.aabhaId}
						onChange={handleChange}
						autoComplete='off'
					/>
				</div>
				<div className='flex flex-col gap-4 md:w-1/3 border-r-2'>
					<Input
						name='address'
						placeholder='Address'
						value={formData.address}
						onChange={handleChange}
						autoComplete='off'
						required
					/>

					<InsuranceInfo
						insuranceType={insuranceType}
						setInsuranceType={setInsuranceType}
						insuranceId={insuranceId}
						setInsuranceId={setInsuranceId}
					/>

					<div className='flex flex-col gap-1'>
						<label className='text-sm font-medium text-muted-foreground'>
							Date of Birth or Age
						</label>

						<div className='flex items-center gap-2 mb-2'>
							<Checkbox
								id='useAge'
								checked={useAgeInstead}
								onCheckedChange={(checked) =>
									setUseAgeInstead(!!checked)
								}
							/>
							<label htmlFor='useAge' className='text-sm'>
								Enter Age
							</label>
						</div>

						{useAgeInstead ? (
							<Input
								type='number'
								min={0}
								max={120}
								placeholder='Enter Age (e.g. 55)'
								value={ageInput}
								onChange={(e) => setAgeInput(e.target.value)}
							/>
						) : (
							<input
								type='date'
								value={dob}
								max={format(new Date(), 'yyyy-MM-dd')}
								onChange={(e) => setDob(e.target.value)}
								className='w-full border rounded-md px-3 py-2 text-sm'
								autoComplete='off'
							/>
						)}
					</div>
					{/* Sex */}
					<Select
						value={formData.sex}
						onValueChange={(val) => {
							setFormData((p) => ({ ...p, sex: val }))
							// When sex changes, clear previously selected diseases
							// This ensures no invalid gender-specific diseases remain selected
							setSelectedDiseases([])
						}}
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Select Sex' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='male'>Male</SelectItem>
							<SelectItem value='female'>Female</SelectItem>
							<SelectItem value='other'>Other</SelectItem>{' '}
							{/* 'other' implies show all */}
						</SelectContent>
					</Select>

					{/* Status Dropdown */}
					<Select
						defaultValue='Alive'
						value={formData.status}
						onValueChange={(val) =>
							setFormData((p) => ({
								...p,
								status: val,
							}))
						}
					>
						<SelectTrigger className='w-full'>
							<SelectValue>
								{formData.status ? (
									<span
										className={cn('font-medium', {
											'text-green-600':
												formData.status === 'Alive',
											'text-red-600':
												formData.status === 'Death',
											'text-blue-600':
												formData.status === 'Ongoing',
											'text-yellow-600':
												formData.status === 'Followup',
										})}
									>
										{formData.status}
									</span>
								) : (
									'Select Status'
								)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='Alive'>
								<span className='text-green-600'>Alive</span>
							</SelectItem>
							<SelectItem value='Death'>
								<span className='text-red-600'>Death</span>
							</SelectItem>
							<SelectItem value='Ongoing'>
								<span className='text-blue-600'>Ongoing</span>
							</SelectItem>
							<SelectItem value='Followup'>
								<span className='text-yellow-600'>
									Followup
								</span>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='flex flex-col gap-4 md:w-1/3'>
					{/* Diseases Multi-Select */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								className={cn(
									'w-full text-left p-2 min-h-[100px]',
									{
										'text-muted-foreground':
											selectedDiseases.length === 0,
									}
								)}
							>
								<div className='flex flex-wrap items-start gap-1 max-h-24 overflow-y-auto'>
									{selectedDiseases.length > 0 ? (
										selectedDiseases.map((disease, i) => (
											<span
												key={i}
												className='bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground'
											>
												{disease}
											</span>
										))
									) : (
										<span>Select Diseases</span>
									)}
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className='flex justify-center w-full'
							align='start'
						>
							<Tabs defaultValue='solid' className='w-full'>
								<TabsList className='grid w-full grid-cols-2 mb-2'>
									<TabsTrigger value='solid'>
										Solid Tumors
									</TabsTrigger>
									<TabsTrigger value='blood'>
										Blood-Related
									</TabsTrigger>
								</TabsList>

								<TabsContent value='solid' className=''>
									<div className='h-[280px] overflow-y-auto'>
										<div
											className={`grid space-x-6 space-y-2 px-4 ${
												DISEASES.solid.length > 5
													? 'grid-cols-2'
													: 'grid-cols-1'
											}`}
										>
											{DISEASES.solid
												.filter((d) => {
													// This is the core filtering logic for gender
													if (
														formData.sex === 'male'
													) {
														return (
															d.gender ===
																undefined ||
															d.gender === 'male'
														)
													} else if (
														formData.sex ===
														'female'
													) {
														return (
															d.gender ===
																undefined ||
															d.gender ===
																'female'
														)
													}
													// For 'other' or no sex selected, show all diseases
													return true
												})
												.map(({ label }) => (
													<label
														key={label}
														className='flex items-center gap-1 cursor-pointer'
													>
														<Checkbox
															checked={selectedDiseases.includes(
																label
															)}
															onCheckedChange={(
																checked
															) => {
																setSelectedDiseases(
																	(prev) =>
																		checked
																			? [
																					...prev,
																					label,
																			  ]
																			: prev.filter(
																					(
																						d
																					) =>
																						d !==
																						label
																			  )
																)
															}}
														/>
														<span className='text-sm ml-1'>
															{label}
														</span>
													</label>
												))}
											<div className='mt-4 border-t pt-4'>
												<label className='flex items-center gap-2 text-sm cursor-pointer'>
													<Checkbox
														checked={selectedDiseases.some(
															(d) =>
																!DISEASES.solid
																	.concat(
																		DISEASES.blood
																	)
																	.some(
																		(x) =>
																			x.label ===
																			d
																	)
														)}
														onCheckedChange={(
															checked
														) => {
															if (!checked) {
																// Remove any custom diseases not in the official list
																setSelectedDiseases(
																	(prev) =>
																		prev.filter(
																			(
																				d
																			) =>
																				DISEASES.solid
																					.concat(
																						DISEASES.blood
																					)
																					.some(
																						(
																							x
																						) =>
																							x.label ===
																							d
																					)
																		)
																)
															} else {
																setSelectedDiseases(
																	(prev) => [
																		...prev,
																		'',
																	]
																) // placeholder
															}
														}}
													/>
													<span>Enter disease</span>
												</label>

												{/* Input for manual entry (only if user selected checkbox) */}
												{selectedDiseases.some(
													(d) =>
														!DISEASES.solid
															.concat(
																DISEASES.blood
															)
															.some(
																(x) =>
																	x.label ===
																	d
															)
												) && (
													<Input
														className='mt-2'
														placeholder='Type disease name'
														value={
															selectedDiseases.find(
																(d) =>
																	!DISEASES.solid
																		.concat(
																			DISEASES.blood
																		)
																		.some(
																			(
																				x
																			) =>
																				x.label ===
																				d
																		)
															) || ''
														}
														onChange={(e) => {
															const value =
																e.target.value
															setSelectedDiseases(
																(prev) => {
																	const filtered =
																		prev.filter(
																			(
																				d
																			) =>
																				DISEASES.solid
																					.concat(
																						DISEASES.blood
																					)
																					.some(
																						(
																							x
																						) =>
																							x.label ===
																							d
																					)
																		)
																	return value
																		? [
																				...filtered,
																				value,
																		  ]
																		: filtered
																}
															)
														}}
													/>
												)}
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent value='blood'>
									<div className='h-[250px] overflow-y-auto'>
										<div
											className={`grid space-x-4 space-y-2 px-4 ${
												DISEASES.blood.length > 5
													? 'grid-cols-2'
													: 'grid-cols-1'
											}`}
										>
											{DISEASES.blood
												.filter((d) => {
													// Apply same filtering logic for blood-related diseases
													if (
														formData.sex === 'male'
													) {
														return (
															d.gender ===
																undefined ||
															d.gender === 'male'
														)
													} else if (
														formData.sex ===
														'female'
													) {
														return (
															d.gender ===
																undefined ||
															d.gender ===
																'female'
														)
													}
													return true // Show all for 'other' or no sex
												})
												.map(({ label }) => (
													<label
														key={label}
														className='flex items-center gap-1 cursor-pointer'
													>
														<Checkbox
															checked={selectedDiseases.includes(
																label
															)}
															onCheckedChange={(
																checked
															) => {
																setSelectedDiseases(
																	(prev) =>
																		checked
																			? [
																					...prev,
																					label,
																			  ]
																			: prev.filter(
																					(
																						d
																					) =>
																						d !==
																						label
																			  )
																)
															}}
														/>
														<span className='text-sm ml-1'>
															{label}
														</span>
													</label>
												))}
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</PopoverContent>
					</Popover>

					<Select
						value={formData.rationCardColor}
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
							<SelectItem value='yellow'>Yellow</SelectItem>
							<SelectItem value='none'>None</SelectItem>
						</SelectContent>
					</Select>

					<HospitalSearch
						value={selectedPhc}
						onValueChange={setSelectedPhc}
					/>

					<div className='space-y-4'>
						<label className='flex flex-col'>
							<span className='text-muted-foreground text-sm'>
								Diagnosed Date
							</span>
							<Input
								type='date'
								value={diagnosedDate}
								onChange={(e) =>
									setDiagnosedDate(e.target.value)
								}
							/>
						</label>

						<label className='flex flex-col'>
							<span className='text-muted-foreground text-sm'>
								Or Years Ago
							</span>
							<Input
								type='number'
								min='0'
								max='100'
								placeholder='e.g. 2'
								value={diagnosedYearsAgo}
								onChange={(e) =>
									setDiagnosedYearsAgo(e.target.value)
								}
							/>
						</label>
					</div>
				</div>
			</div>
		</form>
	)
}
