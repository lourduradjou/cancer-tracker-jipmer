import { Controller, UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PatientFormInputs } from "@/schema/patient"

interface TreatmentFieldProps {
    form: UseFormReturn<PatientFormInputs>
    isEdit?: boolean
}
const TreatmentDropdown = ({ form }: TreatmentFieldProps ) => {
  const {watch, control} = form
  const selectedTreatment = watch("treatmentDetails") // watch selected value

  return (
    <Controller
      control={control}
      name="treatmentDetails"
      render={({ field }) => (
        <div className="w-full space-y-2">
          <Select
            value={field.value}
            onValueChange={(val) => field.onChange(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Treatment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="chemotherapy">Chemotherapy</SelectItem>
              <SelectItem value="radiation">Radiation</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>

        </div>
      )}
    />
  )
}

export default TreatmentDropdown
