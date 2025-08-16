// 'use client'

// import React, { useRef } from 'react'
// import {
//     Controller,
//     useFieldArray,
//     UseFormHandleSubmit,
//     UseFormReset,
//     UseFormReturn,
// } from 'react-hook-form'
// import { format } from 'date-fns'
// import { MinusCircle, PlusCircle, X } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Input } from '@/components/ui/input'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'

// import { cn } from '@/lib/utils'
// import { AVAILABLE_DISEASES_LIST } from '@/constants/diseases'
// import HospitalSearch from '../../search/HospitalSearch'
// import InsuranceInfo from './InsuranceInfo'

// import { PatientFormInputs } from '@/schema/patient'
// import { DialogFooter } from '@/components/ui/dialog'
// import { PhoneInput } from '@/components/ui/phone-input'

// const MAX_PHONE_NUMBERS = 10

// interface PatientFormProps {
//     form: UseFormReturn<PatientFormInputs>
//     reset: UseFormReset<PatientFormInputs>
//     handleSubmit: UseFormHandleSubmit<PatientFormInputs>
//     onSubmit: (data: PatientFormInputs) => Promise<void>
// }

// export default function PatientForm({ form, reset, handleSubmit, onSubmit }: PatientFormProps) {
//     const {
//         register,
//         control,
//         watch,
//         setValue,
//         formState: { errors },
//     } = form

//     // ------------------- Aadhaar (3-part UI, single field in form: aadhaarId) -------------------
//     const aadhaarId = watch('aadhaarId') || ''
//     const hasAadhaar = watch('hasAadhaar') ?? true

//     console.log('see my')

//     const clamp12 = (s: string) => (s || '').replace(/\D/g, '').slice(0, 12)
//     const getPart = (idx: 0 | 1 | 2) => clamp12(aadhaarId).slice(idx * 4, idx * 4 + 4)

//     const aadhaarRefs = useRef<Array<HTMLInputElement | null>>([])

//     const handleAadhaarPartChange = (idx: 0 | 1 | 2, raw: string) => {
//         const part = raw.replace(/\D/g, '').slice(0, 4)
//         const p0 = idx === 0 ? part : getPart(0)
//         const p1 = idx === 1 ? part : getPart(1)
//         const p2 = idx === 2 ? part : getPart(2)
//         const next = (p0 + p1 + p2).slice(0, 12)
//         setValue('aadhaarId', next, { shouldValidate: true, shouldDirty: true })
//         if (part.length === 4 && aadhaarRefs.current[idx + 1]) {
//             aadhaarRefs.current[idx + 1]?.focus()
//         }
//     }

//     // ------------------- Phone numbers (useFieldArray over phoneNumber: string[]) -------------------
//     const { fields, append, remove } = useFieldArray({ control, name: 'phoneNumber' })

//     const formatPhoneDisplay = (raw: string) => {
//         const digits = (raw || '').replace(/\D/g, '').slice(0, 10)
//         if (digits.length <= 4) return digits
//         if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`
//         return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`
//     }
//     const normalizePhone = (input: string) => input.replace(/\D/g, '').slice(0, 10)

//     // ------------------- Sex + diseases logic -------------------
//     const sex = watch('sex') as 'male' | 'female' | 'other' | undefined
//     const selectedDiseases: string[] = watch('diseases') || []

//     const allKnownLabels = new Set(
//         [...AVAILABLE_DISEASES_LIST.solid, ...AVAILABLE_DISEASES_LIST.blood].map((d) => d.label)
//     )

//     const toggleDisease = (label: string, checked: boolean) => {
//         const next = checked
//             ? Array.from(new Set([...(selectedDiseases || []), label]))
//             : (selectedDiseases || []).filter((d) => d !== label)
//         setValue('diseases', next, { shouldDirty: true, shouldValidate: true })
//     }

//     const clearGenderIncompatible = () => {
//         // if sex changes, drop diseases that are gender-specific to the other sex
//         const allowed = (item: { label: string; gender?: 'male' | 'female' }) => {
//             if (!item.gender) return true
//             if (!sex || sex === 'other') return true
//             return item.gender === sex
//         }
//         const validKnown = [...AVAILABLE_DISEASES_LIST.solid, ...AVAILABLE_DISEASES_LIST.blood]
//             .filter(allowed)
//             .map((d) => d.label)
//         const next = (selectedDiseases || []).filter(
//             (d) => !allKnownLabels.has(d) || validKnown.includes(d)
//         )
//         setValue('diseases', next, { shouldDirty: true })
//     }

//     // ------------------- Custom disease entry (optional) -------------------
//     const customDisease = (selectedDiseases || []).find((d) => !allKnownLabels.has(d)) || ''
//     const isCustomDiseaseSelected = Boolean(customDisease)

//     const toggleCustomDisease = (checked: boolean) => {
//         if (!checked) {
//             const next = (selectedDiseases || []).filter((d) => allKnownLabels.has(d))
//             setValue('diseases', next, { shouldDirty: true })
//         } else {
//             // add empty placeholder to let the input control the value
//             setValue('diseases', [...(selectedDiseases || []), ''], { shouldDirty: true })
//         }
//     }

//     const updateCustomDisease = (value: string) => {
//         const keepKnown = (selectedDiseases || []).filter((d) => allKnownLabels.has(d))
//         const next = value ? [...keepKnown, value] : keepKnown
//         setValue('diseases', next, { shouldDirty: true })
//     }

//     console.log('Form errors:', errors)

//     // ---------- UI ----------
//     return (
//         // keep this a form to preserve semantics, but don't submit here
//         <form onSubmit={handleSubmit(onSubmit)} className="grid min-w-full gap-6 py-4 select-none">
//             <div className="flex w-full flex-col gap-6 md:flex-row">
//                 {/* ======================= LEFT COLUMN ======================= */}
//                 <div className="flex flex-col gap-4 md:w-1/3">
//                     {/* Name */}
//                     <div className="flex flex-col gap-1">
//                         <Input
//                             placeholder="Full Name"
//                             autoComplete="off"
//                             aria-autocomplete="none"
//                             {...register('name')}
//                         />
//                         {errors.name && (
//                             <p className="text-sm text-red-500">{String(errors.name.message)}</p>
//                         )}
//                     </div>

//                     {/* "No Aadhaar" (inverts hasAadhaar) */}
//                     <div className="mt-2 flex items-center space-x-2">
//                         <Controller
//                             control={control}
//                             name="hasAadhaar"
//                             render={({ field }) => (
//                                 <>
//                                     <Checkbox
//                                         id="noAadhaar"
//                                         checked={!field.value}
//                                         onCheckedChange={(checked) =>
//                                             field.onChange(!Boolean(checked))
//                                         }
//                                     />
//                                     <label
//                                         htmlFor="noAadhaar"
//                                         className="text-muted-foreground text-sm"
//                                     >
//                                         No Aadhaar
//                                     </label>
//                                 </>
//                             )}
//                         />
//                     </div>

//                     {/* Aadhaar – 3 inputs, single value in form: aadhaarId */}
//                     <div className="flex flex-col gap-1">
//                         <label className="text-muted-foreground text-sm font-medium">
//                             Aadhaar Number
//                         </label>
//                         <div className="flex gap-2">
//                             {([0, 1, 2] as const).map((idx) => (
//                                 <Input
//                                     key={idx}
//                                     placeholder="_ _ _ _"
//                                     className="w-2/3 text-center text-lg"
//                                     maxLength={4}
//                                     value={getPart(idx)}
//                                     onChange={(e) => handleAadhaarPartChange(idx, e.target.value)}
//                                     disabled={!hasAadhaar}
//                                     autoComplete="off"
//                                     ref={(el) => (aadhaarRefs.current[idx] = el)}
//                                 />
//                             ))}
//                         </div>
//                         {errors.aadhaarId && (
//                             <p className="text-sm text-red-500">
//                                 {String(errors.aadhaarId.message)}
//                             </p>
//                         )}
//                     </div>

//                     {/* Phone numbers (dynamic) */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-muted-foreground text-sm font-medium">
//                             Phone Numbers (Max {MAX_PHONE_NUMBERS})
//                         </label>

//                         {fields.map((field, index) => (
//                             <div key={field.id} className="flex items-center gap-2">
//                                 <Controller
//                                     control={control}
//                                     name={`phoneNumber.${index}`}
//                                     render={({ field }) => (
//                                         <PhoneInput
//                                             {...field}
//                                             placeholder="Enter phone number"
//                                             className="flex-grow"
//                                             defaultCountry="IN"
//                                             // If your PhoneInput emits `onChange` with the number
//                                             value={field.value || ''}
//                                             onChange={(val: string) => field.onChange(val)}
//                                         />
//                                     )}
//                                 />

//                                 {fields.length > 1 && (
//                                     <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() => remove(index)}
//                                         className="text-red-500 hover:text-red-700"
//                                     >
//                                         <MinusCircle className="h-4 w-4" />
//                                     </Button>
//                                 )}
//                             </div>
//                         ))}

//                         {fields.length < MAX_PHONE_NUMBERS && (
//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 className="w-fit px-2"
//                                 onClick={() => append('')}
//                             >
//                                 <PlusCircle className="mr-1 h-4 w-4" />
//                                 Add phone
//                             </Button>
//                         )}
//                     </div>
//                 </div>

//                 {/* ======================= MIDDLE COLUMN ======================= */}
//                 <div className="mx-1 flex flex-col gap-4 border-x-2 px-4 md:w-1/3">
//                     {/* Address */}
//                     <Input autoComplete="off" placeholder="Address" {...register('address')} />

//                     {/* Insurance - refactor your <InsuranceInfo> to accept { form } and use form.register/Controller inside */}
//                     <InsuranceInfo form={form} />

//                     {/* DOB or Age */}
//                     <div className="flex flex-col gap-1">
//                         <label className="text-muted-foreground text-sm font-medium">
//                             Date of Birth or Age
//                         </label>

//                         <div className="mb-2 flex items-center gap-2">
//                             <Controller
//                                 control={control}
//                                 name="useAgeInstead"
//                                 render={({ field }) => (
//                                     <>
//                                         <Checkbox
//                                             id="useAge"
//                                             checked={Boolean(field.value)}
//                                             onCheckedChange={(checked) =>
//                                                 field.onChange(Boolean(checked))
//                                             }
//                                         />
//                                         <label htmlFor="useAge" className="text-sm">
//                                             Enter Age
//                                         </label>
//                                     </>
//                                 )}
//                             />
//                         </div>

//                         {watch('useAgeInstead') ? (
//                             <Input
//                                 type="number"
//                                 min={0}
//                                 max={120}
//                                 placeholder="Enter Age (e.g. 55)"
//                                 {...register('age', { valueAsNumber: true })}
//                             />
//                         ) : (
//                             <input
//                                 type="date"
//                                 max={format(new Date(), 'yyyy-MM-dd')}
//                                 {...register('dob')}
//                                 className="w-full rounded-md border px-3 py-2 text-sm"
//                                 autoComplete="off"
//                             />
//                         )}
//                     </div>

//                     {/* Sex */}
//                     <Controller
//                         control={control}
//                         name="sex"
//                         render={({ field }) => (
//                             <Select
//                                 value={field.value}
//                                 onValueChange={(val) => {
//                                     field.onChange(val)
//                                     clearGenderIncompatible()
//                                 }}
//                             >
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Sex" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="male">Male</SelectItem>
//                                     <SelectItem value="female">Female</SelectItem>
//                                     <SelectItem value="other">Other</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         )}
//                     />

//                     {/* Status */}
//                     <Controller
//                         control={control}
//                         name="status"
//                         render={({ field }) => (
//                             <Select value={field.value} onValueChange={field.onChange}>
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue>
//                                         {field.value ? (
//                                             <span
//                                                 className={cn('font-medium', {
//                                                     'text-green-600': field.value === 'Alive',
//                                                     'text-red-600': field.value === 'Death',
//                                                     'text-blue-600': field.value === 'Ongoing',
//                                                     'text-yellow-600': field.value === 'Followup',
//                                                 })}
//                                             >
//                                                 {field.value}
//                                             </span>
//                                         ) : (
//                                             'Select Status'
//                                         )}
//                                     </SelectValue>
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Alive">
//                                         <span className="text-green-600">Alive</span>
//                                     </SelectItem>
//                                     <SelectItem value="Death">
//                                         <span className="text-red-600">Death</span>
//                                     </SelectItem>
//                                     <SelectItem value="Ongoing">
//                                         <span className="text-blue-600">Ongoing</span>
//                                     </SelectItem>
//                                     <SelectItem value="Followup">
//                                         <span className="text-yellow-600">Followup</span>
//                                     </SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         )}
//                     />
//                 </div>

//                 {/* ======================= RIGHT COLUMN ======================= */}
//                 <div className="flex flex-col gap-4 md:w-1/3">
//                     {/* Diseases Multi-Select */}
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className={cn('min-h-[100px] w-full p-2 text-left', {
//                                     'text-muted-foreground': selectedDiseases.length === 0,
//                                 })}
//                             >
//                                 <div className="flex max-h-24 flex-wrap items-start gap-1 overflow-y-auto">
//                                     {selectedDiseases.length > 0 ? (
//                                         selectedDiseases.map((disease, i) => (
//                                             <span
//                                                 key={`${disease}-${i}`}
//                                                 className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs"
//                                             >
//                                                 {disease || '—'}
//                                             </span>
//                                         ))
//                                     ) : (
//                                         <span>Select Diseases</span>
//                                     )}
//                                 </div>
//                             </Button>
//                         </PopoverTrigger>

//                         <PopoverContent className="flex w-full justify-center" align="start">
//                             <Tabs defaultValue="solid" className="w-full">
//                                 <TabsList className="mb-2 grid w-full grid-cols-2">
//                                     <TabsTrigger value="solid">Solid Tumors</TabsTrigger>
//                                     <TabsTrigger value="blood">Blood-Related</TabsTrigger>
//                                 </TabsList>

//                                 {/* Solid */}
//                                 <TabsContent value="solid">
//                                     <div className="h-[280px] overflow-y-auto">
//                                         <div
//                                             className={`grid space-y-2 space-x-6 px-4 ${
//                                                 AVAILABLE_DISEASES_LIST.solid.length > 5
//                                                     ? 'grid-cols-2'
//                                                     : 'grid-cols-1'
//                                             }`}
//                                         >
//                                             {AVAILABLE_DISEASES_LIST.solid
//                                                 .filter((d) => {
//                                                     if (sex === 'male')
//                                                         return (
//                                                             d.gender === undefined ||
//                                                             d.gender === 'male'
//                                                         )
//                                                     if (sex === 'female')
//                                                         return (
//                                                             d.gender === undefined ||
//                                                             d.gender === 'female'
//                                                         )
//                                                     return true
//                                                 })
//                                                 .map(({ label }) => (
//                                                     <label
//                                                         key={label}
//                                                         className="flex cursor-pointer items-center gap-1"
//                                                     >
//                                                         <Checkbox
//                                                             checked={selectedDiseases.includes(
//                                                                 label
//                                                             )}
//                                                             onCheckedChange={(checked) =>
//                                                                 toggleDisease(
//                                                                     label,
//                                                                     Boolean(checked)
//                                                                 )
//                                                             }
//                                                         />
//                                                         <span className="ml-1 text-sm">
//                                                             {label}
//                                                         </span>
//                                                     </label>
//                                                 ))}

//                                             <div className="mt-4 border-t pt-4">
//                                                 <label className="flex cursor-pointer items-center gap-2 text-sm">
//                                                     <Checkbox
//                                                         checked={isCustomDiseaseSelected}
//                                                         onCheckedChange={(c) =>
//                                                             toggleCustomDisease(Boolean(c))
//                                                         }
//                                                     />
//                                                     <span>Enter disease</span>
//                                                 </label>

//                                                 {isCustomDiseaseSelected && (
//                                                     <Input
//                                                         className="mt-2"
//                                                         placeholder="Type disease name"
//                                                         value={customDisease}
//                                                         onChange={(e) =>
//                                                             updateCustomDisease(e.target.value)
//                                                         }
//                                                     />
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </TabsContent>

//                                 {/* Blood */}
//                                 <TabsContent value="blood">
//                                     <div className="h-[250px] overflow-y-auto">
//                                         <div
//                                             className={`grid space-y-2 space-x-4 px-4 ${
//                                                 AVAILABLE_DISEASES_LIST.blood.length > 5
//                                                     ? 'grid-cols-2'
//                                                     : 'grid-cols-1'
//                                             }`}
//                                         >
//                                             {AVAILABLE_DISEASES_LIST.blood
//                                                 .filter((d) => {
//                                                     if (sex === 'male')
//                                                         return (
//                                                             d.gender === undefined ||
//                                                             d.gender === 'male'
//                                                         )
//                                                     if (sex === 'female')
//                                                         return (
//                                                             d.gender === undefined ||
//                                                             d.gender === 'female'
//                                                         )
//                                                     return true
//                                                 })
//                                                 .map(({ label }) => (
//                                                     <label
//                                                         key={label}
//                                                         className="flex cursor-pointer items-center gap-1"
//                                                     >
//                                                         <Checkbox
//                                                             checked={selectedDiseases.includes(
//                                                                 label
//                                                             )}
//                                                             onCheckedChange={(checked) =>
//                                                                 toggleDisease(
//                                                                     label,
//                                                                     Boolean(checked)
//                                                                 )
//                                                             }
//                                                         />
//                                                         <span className="ml-1 text-sm">
//                                                             {label}
//                                                         </span>
//                                                     </label>
//                                                 ))}
//                                         </div>
//                                     </div>
//                                 </TabsContent>
//                             </Tabs>
//                         </PopoverContent>
//                     </Popover>

//                     {/* Ration Card Color */}
//                     <Controller
//                         control={control}
//                         name="rationCardColor"
//                         render={({ field }) => (
//                             <Select value={field.value} onValueChange={field.onChange}>
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Ration Card Color" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="red">Red</SelectItem>
//                                     <SelectItem value="yellow">Yellow</SelectItem>
//                                     <SelectItem value="none">None</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         )}
//                     />

//                     {/* PHC / Hospital */}
//                     <HospitalSearch
//                         value={{
//                             id: watch('assignedHospitalId') || '',
//                             name: watch('assignedHospitalName') || '',
//                         }}
//                         onValueChange={(hospital) => {
//                             setValue('assignedHospitalId', hospital.id, {
//                                 shouldDirty: true,
//                                 shouldValidate: true,
//                             })
//                             setValue('assignedHospitalName', hospital.name, {
//                                 shouldDirty: true,
//                                 shouldValidate: true,
//                             })
//                         }}
//                     />

//                     {/* Diagnosis timing */}
//                     <div className="space-y-4">
//                         <label className="flex flex-col">
//                             <span className="text-muted-foreground text-sm">Diagnosed Date</span>
//                             <Input type="date" {...register('diagnosedDate')} />
//                         </label>

//                         <label className="flex flex-col">
//                             <span className="text-muted-foreground text-sm">Or Years Ago</span>
//                             <Input
//                                 type="number"
//                                 min={0}
//                                 max={100}
//                                 placeholder="e.g. 2"
//                                 {...register('diagnosedYearsAgo', { valueAsNumber: true })}
//                             />
//                         </label>
//                     </div>
//                 </div>
//             </div>
//             <div className="mt-6 flex justify-between gap-2">
//                 <Button
//                     variant="outline"
//                     onClick={() => reset()}
//                     type="button"
//                     className="h-12 w-[20%] border-red-500 text-red-600"
//                 >
//                     <X className="h-4 w-4" /> Clear
//                 </Button>
//                 <Button type="submit" className="h-12 w-[80%]">
//                     Save
//                 </Button>
//             </div>
//         </form>
//     )
// }
