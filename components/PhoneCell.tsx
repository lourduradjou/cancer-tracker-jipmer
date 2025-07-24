import { useState } from 'react'
import { TableCell } from '@/components/ui/table'

export default function PhoneCell({ phoneNumbers }: { phoneNumbers: string[] }) {
	const [showAll, setShowAll] = useState(false)

	const MAX_DISPLAY = 2
	const MAX_ALLOWED = 10

	// Trim if above allowed limit
	if (phoneNumbers.length > MAX_ALLOWED) {
		console.warn(`Too many phone numbers! Max allowed is ${MAX_ALLOWED}.`)
		phoneNumbers = phoneNumbers.slice(0, MAX_ALLOWED)
	}

	const displayNumbers = showAll ? phoneNumbers : phoneNumbers.slice(0, MAX_DISPLAY)
	const remaining = phoneNumbers.length - MAX_DISPLAY

	return (
		<div className=" border-border whitespace-pre-wrap">
			{displayNumbers.map((num, i) => (
				<div key={i} className=''>{num}</div>
			))}

			{!showAll && remaining > 0 && (
				<div
					className="text-blue-500 cursor-pointer underline "
					onClick={() => setShowAll(true)}
				>
					... {remaining} more
				</div>
			)}

			{showAll && phoneNumbers.length > MAX_DISPLAY && (
				<div
					className="text-blue-500 cursor-pointer underline"
					onClick={() => setShowAll(false)}
				>
					Show less
				</div>
			)}
		</div>
	)
}
