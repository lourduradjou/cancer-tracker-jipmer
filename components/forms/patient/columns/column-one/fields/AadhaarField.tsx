'use client'

import React, { useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

interface AadhaarFieldProps {
    form: UseFormReturn<PatientFormInputs>
}

export default function AadhaarField({ form }: AadhaarFieldProps) {
    const { control, watch, setValue } = form
    const aadhaarId = watch('aadhaarId') || ''
    const hasAadhaar = watch('hasAadhaar') ?? true
    const aadhaarRefs = useRef<Array<HTMLInputElement | null>>([])

    const clamp12 = (s: string) => (s || '').replace(/\D/g, '').slice(0, 12)
    const getPart = (idx: 0 | 1 | 2) => clamp12(aadhaarId).slice(idx * 4, idx * 4 + 4)

    const handleAadhaarPartChange = (idx: 0 | 1 | 2, raw: string) => {
        const part = raw.replace(/\D/g, '').slice(0, 4)
        const p0 = idx === 0 ? part : getPart(0)
        const p1 = idx === 1 ? part : getPart(1)
        const p2 = idx === 2 ? part : getPart(2)
        const next = (p0 + p1 + p2).slice(0, 12)
        setValue('aadhaarId', next, { shouldValidate: true, shouldDirty: true })
        if (part.length === 4 && aadhaarRefs.current[idx + 1]) {
            aadhaarRefs.current[idx + 1]?.focus()
        }
    }

    return (
        <>
            <FormField
                control={control}
                name="hasAadhaar"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                        <FormControl>
                            <Checkbox
                                checked={!field.value}
                                onCheckedChange={(checked) => field.onChange(!Boolean(checked))}
                            />
                        </FormControl>
                        <FormLabel className="text-muted-foreground text-sm">No Aadhaar</FormLabel>
                    </FormItem>
                )}
            />

            <FormItem>
                <FormLabel>Aadhaar Number</FormLabel>
                <div className="flex gap-2">
                    {([0, 1, 2] as const).map((idx) => (
                        <Input
                            key={idx}
                            placeholder="_ _ _ _"
                            className="w-2/3 text-center text-lg"
                            maxLength={4}
                            value={getPart(idx)}
                            onChange={(e) => handleAadhaarPartChange(idx, e.target.value)}
                            disabled={!hasAadhaar}
                            autoComplete="off"
                            ref={(el) => { aadhaarRefs.current[idx] = el }}
                        />
                    ))}
                </div>
                <FormMessage />
            </FormItem>
        </>
    )
}
