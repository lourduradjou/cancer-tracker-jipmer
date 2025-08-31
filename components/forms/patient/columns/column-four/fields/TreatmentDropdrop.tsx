'use client'

import { Controller, UseFormReturn } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { PatientFormInputs } from '@/schema/patient'

interface TreatmentFieldProps {
  form: UseFormReturn<PatientFormInputs>
  isEdit?: boolean
}

const TREATMENT_OPTIONS = [
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Chemotherapy', label: 'Chemotherapy' },
  { value: 'Radiation', label: 'Radiation' },
  { value: 'others', label: 'Others (Custom)' },
]

const TreatmentDropdown = ({ form }: TreatmentFieldProps) => {
  const { control, watch, setValue } = form
  const selectedTreatments = watch('treatmentDetails') || []

  return (
    <div className="w-full space-y-2">
      <Controller
        control={control}
        name="treatmentDetails"
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex-wrap justify-start gap-2 min-h-[5.5rem]"
              >
                {selectedTreatments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTreatments.map((treatment) => (
                      <div
                        key={treatment}
                        className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-sm"
                      >
                        <span>{treatment}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const newValues = selectedTreatments.filter((v) => v !== treatment)
                            field.onChange(newValues)
                          }}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Select Treatments'
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-2">
              <Command>
                <CommandGroup>
                  {TREATMENT_OPTIONS.map((option) => {
                    const isSelected = selectedTreatments.includes(option.value)

                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          let newValues = [...selectedTreatments]

                          if (isSelected) {
                            newValues = newValues.filter((v) => v !== option.value)
                          } else {
                            newValues.push(option.value)
                          }

                          field.onChange(newValues)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </Command>

              {/* When "Others" is selected, show input field */}
              {selectedTreatments.includes('others') && (
                <div className="mt-3 space-y-2">
                  <Controller
                    control={control}
                    name="otherTreatmentDetails"
                    render={({ field: otherField }) => (
                      <Input
                        {...otherField}
                        placeholder="Please specify other treatment"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && otherField?.value?.trim()) {
                            e.preventDefault()
                            const newValue = otherField?.value?.trim()

                            // prevent duplicates
                            if (!selectedTreatments.includes(newValue)) {
                              const newValues = selectedTreatments
                                .filter((v) => v !== 'others') // remove placeholder
                                .concat(newValue)
                              setValue('treatmentDetails', newValues, { shouldDirty: true })
                            }

                            setValue('otherTreatmentDetails', '', { shouldDirty: true })
                          }
                        }}
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Press Enter to add custom treatment
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}

export default TreatmentDropdown
