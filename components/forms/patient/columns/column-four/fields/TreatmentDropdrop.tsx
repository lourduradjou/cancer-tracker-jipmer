import { Controller, UseFormReturn } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PatientFormInputs } from "@/schema/patient"

interface TreatmentFieldProps {
  form: UseFormReturn<PatientFormInputs>
  isEdit?: boolean
}

const TreatmentDropdown = ({ form }: TreatmentFieldProps) => {
  const { watch, control, setValue } = form
  const selectedTreatment = watch("treatmentDetails")

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 items-center">
        <Controller
          control={control}
          name="treatmentDetails"
          render={({ field }) => (
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
          )}
        />

        {selectedTreatment && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue("treatmentDetails", undefined, { shouldDirty: true })
              setValue("otherTreatmentDetails", "", { shouldDirty: true })
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Show input box only when "others" is selected */}
      {selectedTreatment === "others" && (
        <Controller
          control={control}
          name="otherTreatmentDetails"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Please specify the treatment"
              onChange={(e) => {
                field.onChange(e.target.value)
                // Keep syncing
                setValue("treatmentDetails", e.target.value, { shouldDirty: true })
              }}
            />
          )}
        />
      )}
    </div>
  )
}

export default TreatmentDropdown
