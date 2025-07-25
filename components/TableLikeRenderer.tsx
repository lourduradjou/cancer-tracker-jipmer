// components/TableLikeRenderer.tsx
type Doctor = {
	id?: string | number
	name: string
	specialty: string
	phone: string
}

type Nurse = {
	id?: string | number
	name: string
	ward: string
	shift: string
}

type TableLikeRendererProps =
	| { data: Doctor[]; entity: 'doctor' }
	| { data: Nurse[]; entity: 'nurse' }

export default function TableLikeRenderer({ data, entity }: TableLikeRendererProps) {
	if (!data.length) return <p>No {entity} found.</p>

	const columns =
		entity === 'doctor'
			? ['name', 'specialty', 'phone']
			: ['name', 'ward', 'shift']

	return (
		<table className='w-full border mt-4'>
			<thead>
				<tr>
					{columns.map(col => (
						<th key={col} className='border p-2 capitalize'>
							{col}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((item, idx) => (
					<tr key={item.id || idx}>
						{columns.map(col => (
							<td key={col} className='border p-2'>
								{entity === 'doctor'
									? (item as Doctor)[col as keyof Doctor] ?? '—'
									: (item as Nurse)[col as keyof Nurse] ?? '—'}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}
