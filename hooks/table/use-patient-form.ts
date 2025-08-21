// hooks/use-patient-form.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatientSchema, PatientFormInputs } from '@/schema/patient'
import { usePatientFormStore } from '@/store/patient-form-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { checkAadhaarDuplicateUtil } from '@/lib/patient/checkPatientRecord'

export const usePatientForm = () => {
  const { mode, patientData, closeDialog, onSuccess } = usePatientFormStore()
  const queryClient = useQueryClient()
  const isEdit = mode === 'edit'

  const form = useForm<PatientFormInputs>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: '',
      phoneNumber: [''],
      sex: undefined,
      dob: '',
      age: undefined,
      address: '',
      aadhaarId: '',
      rationCardColor: undefined,
      diseases: [],
      assignedHospitalId: '',
      assignedHospitalName: '',
      status: 'Alive',
      hasAadhaar: true,
      useAgeInstead: false,
    },
  })

  const { watch, reset, handleSubmit } = form
  const aadhaarId = watch('aadhaarId')
  const hasAadhaar = watch('hasAadhaar')

  // Initialize form with patient data for edit mode
  useEffect(() => {
    if (isEdit && patientData) {
      reset(patientData)
    } else if (!isEdit) {
      // Reset to defaults for add mode
      reset({
        name: '',
        phoneNumber: [''],
        sex: undefined,
        dob: '',
        age: undefined,
        address: '',
        aadhaarId: '',
        rationCardColor: undefined,
        diseases: [],
        assignedHospitalId: '',
        assignedHospitalName: '',
        status: 'Alive',
        hasAadhaar: true,
        useAgeInstead: false,
      })
    }
  }, [isEdit, patientData, reset])

  // Aadhaar duplicate check
  useEffect(() => {
    if (hasAadhaar && aadhaarId?.length === 12 &&
        (!isEdit || aadhaarId !== patientData?.aadhaarId)) {
      const timer = setTimeout(async () => {
        await checkAadhaarDuplicateUtil(aadhaarId)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [aadhaarId, hasAadhaar, isEdit, patientData])

  // Save to localStorage (for add mode only)
  useEffect(() => {
    if (!isEdit) {
      localStorage.setItem('addPatientFormData', JSON.stringify(form.getValues()))
    }
  }, [watch(), form, isEdit])

  // Load from localStorage (for add mode only)
  useEffect(() => {
    if (!isEdit) {
      const saved = localStorage.getItem('addPatientFormData')
      if (saved) {
        try {
          reset(JSON.parse(saved))
        } catch {
          console.warn('Invalid saved form data')
        }
      }
    }
  }, [isEdit, reset])

  // Mutation for adding/updating patient
  const mutation = useMutation({
    mutationFn: async (data: PatientFormInputs) => {
      if (isEdit && patientData?.id) {
        await updateDoc(doc(db, 'patients', patientData.id), data)
        return { operation: 'update', id: patientData.id }
      } else {
        const docRef = await addDoc(collection(db, 'patients'), data)
        return { operation: 'add', id: docRef.id }
      }
    },
    onSuccess: (result) => {
      toast.success(`Patient ${result.operation === 'add' ? 'added' : 'updated'} successfully.`)
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      closeDialog()
      reset()
      onSuccess?.()

      if (result.operation === 'add') {
        localStorage.removeItem('addPatientFormData')
      }
    },
    onError: (error) => {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} patient:`, error)
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} patient. Please try again.`)
    }
  })

  const onSubmit = (data: PatientFormInputs) => {
    mutation.mutate(data)
  }

  return {
    form,
    mode,
    isEdit,
    isLoading: mutation.isPending,
    onSubmit: handleSubmit(onSubmit),
    closeDialog,
  }
}
