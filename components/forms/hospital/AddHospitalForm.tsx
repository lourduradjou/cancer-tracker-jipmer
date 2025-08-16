'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { HospitalFormInputs, HospitalSchema } from '@/schema/hospital'
import { PhoneInput } from '@/components/ui/phone-input'

interface AddHospitalFormProps {
    onSuccess?: () => void
    onSubmit: (data: HospitalFormInputs) => Promise<void> | void
}

export default function AddHospitalForm({ onSuccess, onSubmit }: AddHospitalFormProps) {
    const form = useForm<HospitalFormInputs>({
        resolver: zodResolver(HospitalSchema),
        defaultValues: {
            name: '',
            address: '',
            contactNumber: '',
        },
    })

    const handleSubmit = async (data: HospitalFormInputs) => {
        await onSubmit(data) // use parent handler
        onSuccess?.()
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hospital Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter hospital name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter hospital address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phone Number */}
                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    {...field}
                                    placeholder="Enter phone number"
                                    defaultCountry="IN" // ✅ sets default to India
                                    international
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" className="w-full">
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
