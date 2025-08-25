import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { AVAILABLE_DISEASES_LIST } from '@/constants/diseases'
import { useFormContext } from 'react-hook-form'
import { useState } from 'react'

type DiseaseMultiSelectProps = {
    sex: 'male' | 'female' | 'other' | undefined
    selectedDiseases: string[]
    isCustomDiseaseSelected?: boolean
    toggleCustomDisease: (checked: boolean) => void
    customDisease: string
    updateCustomDisease: (value: string) => void
}

export default function DiseaseMultiSelect({
    sex,
    selectedDiseases,
    toggleCustomDisease,
    customDisease,
    updateCustomDisease,
}: DiseaseMultiSelectProps) {
    const { setValue, watch } = useFormContext()
    const [isCustomDiseaseSelected, setIsCustomDiseaseSelected] = useState(false)

    const suspectedCase = watch('suspectedCase') || false

    // Display diseases includes custom disease if selected
    const displayedDiseases =
        isCustomDiseaseSelected && customDisease.trim()
            ? [...selectedDiseases.filter((d) => d !== customDisease), customDisease]
            : selectedDiseases.filter((d) => d.trim() !== '')

    const toggleDisease = (label: string, checked: boolean) => {
        setIsCustomDiseaseSelected(checked)
        const next = checked
            ? Array.from(new Set([...selectedDiseases, label]))
            : selectedDiseases.filter((d) => d !== label)
        setValue('diseases', next, { shouldDirty: true, shouldValidate: true })
    }

    const handleCustomDiseaseToggle = (checked: boolean) => {
        toggleCustomDisease(checked)
        if (!checked) {
            setValue(
                'diseases',
                selectedDiseases.filter((d) => d !== customDisease),
                { shouldDirty: true, shouldValidate: true }
            )
        } else if (customDisease.trim()) {
            setValue('diseases', [...selectedDiseases, customDisease], {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }

    const handleCustomDiseaseChange = (value: string) => {
        if (isCustomDiseaseSelected) {
            const otherDiseases = selectedDiseases.filter((d) => d !== customDisease)
            setValue('diseases', [...otherDiseases, value], {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
        updateCustomDisease(value)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* ---- Enter disease checkbox + input ---- */}
            <div className='flex gap-2'>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                        checked={isCustomDiseaseSelected}
                        onCheckedChange={(c) => handleCustomDiseaseToggle(Boolean(c))}
                    />
                    <span className='text-sm text-muted-foreground'>Enter disease</span>
                </label>

                {/* ---- Suspected Case checkbox ---- */}
                <label className="flex items-center gap-2 text-sm pl-2 border-l-2">
                    <Checkbox
                        checked={suspectedCase}
                        onCheckedChange={(c) =>
                            setValue('suspectedCase', Boolean(c), {
                                shouldDirty: true,
                                shouldValidate: true,
                            })
                        }
                    />
                    <span className='text-sm text-muted-foreground'>Suspected Case</span>
                </label>
            </div>

            {isCustomDiseaseSelected && (
                <Input
                    className="ml-6"
                    placeholder="Type disease name"
                    value={customDisease}
                    onChange={(e) => handleCustomDiseaseChange(e.target.value)}
                />
            )}

            {/* ---- Diseases multi-select box ---- */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            '!bg-background min-h-[100px] w-full !border-red-400 p-2 text-left',
                            {
                                'text-muted-foreground': displayedDiseases.length === 0,
                            }
                        )}
                    >
                        <div className="flex max-h-24 flex-wrap items-start gap-1 overflow-y-auto">
                            {displayedDiseases.length > 0 ? (
                                displayedDiseases.map((disease, i) => (
                                    <span
                                        key={`${disease}-${i}`}
                                        className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs"
                                    >
                                        {disease || '—'}
                                    </span>
                                ))
                            ) : (
                                <span>Select Diseases</span>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="flex w-full justify-center" align="start">
                    <Tabs defaultValue="solid" className="w-full">
                        <TabsList className="mb-2 grid w-full grid-cols-2">
                            <TabsTrigger value="solid">Solid Tumors</TabsTrigger>
                            <TabsTrigger value="blood">Blood-Related</TabsTrigger>
                        </TabsList>

                        {['solid', 'blood'].map((type) => (
                            <TabsContent key={type} value={type}>
                                <div
                                    className={
                                        type === 'solid'
                                            ? 'h-[280px] overflow-y-auto'
                                            : 'h-[250px] overflow-y-auto'
                                    }
                                >
                                    <div
                                        className={`grid space-y-2 px-4 ${
                                            AVAILABLE_DISEASES_LIST[type].length > 5
                                                ? 'grid-cols-2'
                                                : 'grid-cols-1'
                                        }`}
                                    >
                                        {AVAILABLE_DISEASES_LIST[type]
                                            .filter((d) => {
                                                if (sex === 'male')
                                                    return (
                                                        d.gender === undefined ||
                                                        d.gender === 'male'
                                                    )
                                                if (sex === 'female')
                                                    return (
                                                        d.gender === undefined ||
                                                        d.gender === 'female'
                                                    )
                                                return true
                                            })
                                            .map(({ label }) => (
                                                <label
                                                    key={label}
                                                    className="flex cursor-pointer items-center gap-1"
                                                >
                                                    <Checkbox
                                                        checked={selectedDiseases.includes(label)}
                                                        onCheckedChange={(checked) =>
                                                            toggleDisease(label, Boolean(checked))
                                                        }
                                                    />
                                                    <span className="ml-1 text-sm">{label}</span>
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </PopoverContent>
            </Popover>
        </div>
    )
}
