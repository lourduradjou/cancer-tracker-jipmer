// components/TableLikeRenderer.tsx
export default function TableLikeRenderer({
	data,
	entity,
}: {
	data: any[]
	entity: 'doctor' | 'nurse'
}) {
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
								{item[col] ?? '—'}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}
