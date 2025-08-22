import { UseFormReturn } from 'react-hook-form'
import HospitalSearch from '@/components/search/HospitalSearch'
import DiseaseMultiSelect from './fields/DiseaseMultiSelect'
import RationCardSelect from './fields/RationCardSelect'
import DiagnosisTimingField from './fields/DiagnosisTimingField'
import { AVAILABLE_DISEASES_LIST } from '@/constants/diseases'

type RightColumnProps = {
    form: UseFormReturn<any>
    isEdit?: boolean
}

export default function ColumnThree({ form, isEdit = false }: RightColumnProps) {
    const { watch, setValue, control } = form
    const selectedDiseases: string[] = watch('diseases') || []

    const allKnownLabels = new Set(
        [...AVAILABLE_DISEASES_LIST.solid, ...AVAILABLE_DISEASES_LIST.blood].map((d) => d.label)
    )

    const customDisease = (selectedDiseases || []).find((d) => !allKnownLabels.has(d)) || ''
    const isCustomDiseaseSelected = Boolean(customDisease)

    const toggleCustomDisease = (checked: boolean) => {
        if (!checked) {
            const next = (selectedDiseases || []).filter((d) => allKnownLabels.has(d))
            setValue('diseases', next, { shouldDirty: true })
        } else {
            // add empty placeholder to let the input control the value
            setValue('diseases', [...(selectedDiseases || []), ''], { shouldDirty: true })
        }
    }

    const updateCustomDisease = (value: string) => {
        const keepKnown = (selectedDiseases || []).filter((d) => allKnownLabels.has(d))
        const next = value ? [...keepKnown, value] : keepKnown
        setValue('diseases', next, { shouldDirty: true })
    }

    return (
        <div className="flex flex-col gap-4 md:w-1/3">
            <DiseaseMultiSelect
                sex={watch('sex')}
                selectedDiseases={selectedDiseases}
                isCustomDiseaseSelected={isCustomDiseaseSelected}
                toggleCustomDisease={toggleCustomDisease}
                customDisease={customDisease}
                updateCustomDisease={updateCustomDisease}
            />

            <RationCardSelect control={control} />

            <HospitalSearch
                value={{
                    id: watch('assignedHospitalId') || '',
                    name: watch('assignedHospitalName') || '',
                }}
                onValueChange={(hospital) => {
                    setValue('assignedHospitalId', hospital.id, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })
                    setValue('assignedHospitalName', hospital.name, {
                        shouldDirty: true,
                        shouldValidate: true,
                    })
                }}
            />

            <DiagnosisTimingField form={form} />
        </div>
    )
}
