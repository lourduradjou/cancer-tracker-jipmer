import { UseFormReturn } from 'react-hook-form'
import HospitalSearch from '@/components/search/HospitalSearch'
import DiseaseMultiSelect from './fields/DiseaseMultiSelect'
import RationCardSelect from './fields/RationCardSelect'
import DiagnosisTimingField from './fields/DiagnosisTimingField'

type RightColumnProps = {
    form: UseFormReturn<any>
    sex: 'male' | 'female' | 'other' | undefined
    selectedDiseases: string[]
    toggleDisease: (label: string, checked: boolean) => void
    isCustomDiseaseSelected: boolean
    toggleCustomDisease: (checked: boolean) => void
    customDisease: string
    updateCustomDisease: (value: string) => void
}

export default function RightColumn({
    form,
    sex,
    selectedDiseases,
    toggleDisease,
    isCustomDiseaseSelected,
    toggleCustomDisease,
    customDisease,
    updateCustomDisease,
}: RightColumnProps) {
    const { watch, setValue, control } = form

    return (
        <div className="flex flex-col gap-4 md:w-1/3">
            <DiseaseMultiSelect
                sex={sex}
                selectedDiseases={selectedDiseases}
                toggleDisease={toggleDisease}
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
