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
import HospitalSearch from '@/components/search/HospitalSearch'
import { UserFormInputs, UserSchema, UserDoc } from '@/schema/user'

interface GenericUserFormProps {
  user: string
  defaultValues?: Partial<UserDoc>
  onSuccess?: () => void
  onSubmit: (data: UserFormInputs) => Promise<void> | void
}

export default function GenericUserForm({
  user,
  defaultValues,
  onSuccess,
  onSubmit,
}: GenericUserFormProps) {
  const roleValue = user?.endsWith('s') ? user.slice(0, -1) : user

  const form = useForm<UserFormInputs>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: defaultValues?.email ?? '',
      name: defaultValues?.name ?? '',
      sex: defaultValues?.sex ?? undefined,
      role: defaultValues?.role ?? (roleValue as UserFormInputs['role']),
      phoneNumber: defaultValues?.phoneNumber ?? '',
      orgId: defaultValues?.orgId ?? '',
      orgName: defaultValues?.orgName ?? '',
    },
  })

  const handleSubmit = async (data: UserFormInputs) => {
    await onSubmit(data)
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

        {/* Phone number */}
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
                  defaultCountry="IN"
                  international
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4">
          {/* Sex */}
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
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
                  <FormControl>
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

          {/* Hospital */}
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
