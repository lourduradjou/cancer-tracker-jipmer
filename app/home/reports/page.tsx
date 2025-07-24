export default function ReportsPage() {
	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4 text-[#003366]">Reports & Dashboards</h1>

			<p className="mb-6 text-gray-700">
				Below is a summary of available reports and statistics collected through the COMPASS portal across various PHCs and hospitals.
			</p>

			<div className="space-y-4">
				<div className="bg-gray-100 p-4 rounded shadow">
					<h2 className="font-semibold text-lg mb-1">Monthly Patient Entry Reports</h2>
					<p className="text-sm text-gray-600">
						View data entry volume per role (Doctor, Nurse, ASHA) across different months and PHCs.
					</p>
				</div>

				<div className="bg-gray-100 p-4 rounded shadow">
					<h2 className="font-semibold text-lg mb-1">Diagnosis Summary</h2>
					<p className="text-sm text-gray-600">
						Statistical summary of suspected and confirmed cancer cases categorized by type and gender.
					</p>
				</div>

				<div className="bg-gray-100 p-4 rounded shadow">
					<h2 className="font-semibold text-lg mb-1">Navigator Performance</h2>
					<p className="text-sm text-gray-600">
						Track data contributions and follow-up efforts by individual navigators across regions.
					</p>
				</div>
			</div>

			<p className="mt-6 text-sm text-gray-500">
				Note: This is a preview. Detailed analytics and data export will be available in the admin portal.
			</p>
		</div>
	);
}
