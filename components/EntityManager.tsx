// 'use client'

// import { useEffect, useState } from 'react'
// import { collection, getDocs, query, where } from 'firebase/firestore'

// import { db } from '@/firebase'
// import PatientToolbar from './PatientToolbar'
// import PatientTable from './PatientTable'
// import TableLikeRenderer from './TableLikeRenderer'

// type EntityType = 'patients' | 'doctor' | 'nurse' | 'asha' // ✅ Added asha

// export default function EntityManager() {
// 	const [tab, setTab] = useState<EntityType>('patients')
// 	const [data, setData] = useState<any[]>([])
// 	const [loading, setLoading] = useState(false)

// 	// Patient-specific filters
// 	const [searchTerm, setSearchTerm] = useState('')
// 	const [filterSexes, setFilterSexes] = useState<string[]>([])
// 	const [filterDiseases, setFilterDiseases] = useState<string[]>([])
// 	const [filterStatuses, setFilterStatuses] = useState<string[]>([])
// 	const [ageFilter, setAgeFilter] = useState<string | null>(null)
// 	const [filterRationColors, setFilterRationColors] = useState<string[]>([])
// 	const [assignedFilter, setAssignedFilter] = useState<
// 		'assigned' | 'unassigned' | ''
// 	>('')	
// 	const [transferFilter, setTransferFilter] = useState<
// 		'transferred' | 'not_transferred' | ''
// 	>('')

// 	useEffect(() => {
// 		const fetchData = async () => {
// 			setLoading(true)

// 			let docs = []
// 			if (tab === 'patients') {
// 				const snap = await getDocs(collection(db, 'patients'))
// 				docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
// 			} else {
// 				const q = query(
// 					collection(db, 'users'),
// 					where('role', '==', tab)
// 				)
// 				const snap = await getDocs(q)
// 				docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
// 			}

// 			setData(docs)
// 			setLoading(false)
// 		}

// 		fetchData()
// 	}, [tab])

// 	const handleTabChange = (newTab: EntityType) => {
// 		setTab(newTab)
// 	}

// 	return (
// 		<div>
// 			{/* Tabs */}
// 			<div className='flex gap-4 mb-4'>
// 				{(['patients', 'doctor', 'nurse', 'asha'] as EntityType[]).map(
// 					(t) => (
// 						<button
// 							key={t}
// 							onClick={() => handleTabChange(t)}
// 							className={`px-4 py-2 rounded ${
// 								tab === t
// 									? 'bg-blue-600 text-white'
// 									: 'bg-gray-100'
// 							}`}
// 						>
// 							{t.charAt(0).toUpperCase() + t.slice(1)}
// 						</button>
// 					)
// 				)}
// 			</div>

// 			{/* Table rendering */}
// 			{loading ? (
// 				<p>Loading...</p>
// 			) : tab === 'patients' ? (
// 				<PatientTable patients={data} />
// 			) : (
// 				<TableLikeRenderer data={data} entity={tab} />
// 			)}
// 		</div>
// 	)
// }
