'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PhoneInput } from '@/components/ui/phone-input'

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import HospitalSearch from '@/components/search/HospitalSearch' // import your hospital search
import { UserFormInputs, UserSchema } from '@/schema/user'

interface AddUserFormProps {
    user: string
    onSuccess?: () => void
    onSubmit: (data: UserFormInputs) => Promise<void> | void
}

export default function AddUserForm({ user, onSuccess, onSubmit }: AddUserFormProps) {
    // remove last "s" if present
    const roleValue = user.endsWith('s') ? user.slice(0, -1) : user

    const form = useForm<UserFormInputs>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            email: '',
            name: '',
            sex: undefined,
            role: roleValue as UserFormInputs['role'],
            phoneNumber: '',
            orgId: '',
            orgName: '',
        },
    })

    const handleSubmit = async (data: UserFormInputs) => {
        await onSubmit(data) // use parent handler
        onSuccess?.()
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="user@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* phone number */}

                <FormField
                    control={form.control}
                    name="phoneNumber"
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

                <div className="flex space-x-4">
                    {/* Sex (optional) */}
                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>Sex</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value ?? undefined}
                                >
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sex" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Role */}
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="w-full flex-1">
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="nurse">Nurse</SelectItem>
                                        <SelectItem value="asha">Asha</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hospital Search (sets orgId & orgName) */}
                    <FormField
                        control={form.control}
                        name="orgId"
                        render={() => (
                            <FormItem>
                                <FormLabel>Organization</FormLabel>

                                <HospitalSearch
                                    value={{
                                        id: form.watch('orgId'),
                                        name: form.watch('orgName'),
                                    }}
                                    onChange={(hospital) => {
                                        form.setValue('orgId', hospital.id)
                                        form.setValue('orgName', hospital.name)
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" className="w-full">
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
