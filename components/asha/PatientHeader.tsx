'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* 📌 Collapsible Patient Header                                       */
/* ------------------------------------------------------------------ */
export function PatientHeader({
  name,
  address,
  isOpen,
  onToggle,
}: {
  name?: string
  address?: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between p-4 text-left"
    >
      <div>
        <p className="font-medium">{name || 'Unnamed Patient'}</p>
        <p className="text-sm text-gray-600">{address || 'No address'}</p>
      </div>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  )
}
