'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Patient } from '@/types/patient'

export default function ViewPatientDialog({
	open,
	onOpenChange,
	patient,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	patient: Patient
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-3xl bg-card text-card-foreground rounded-xl shadow-md'>
				<DialogHeader>
					<DialogTitle className='text-lg font-semibold'>
						Patient Details
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className='max-h-[70vh] pr-2'>
					<div className='grid md:grid-cols-2 gap-6 text-sm'>
						{/* Left Column */}
						<div className='space-y-2'>
							<Info label='Name' value={patient.name} />
							<Info label='Phone' value={Array.isArray(patient.phoneNumber) ? patient.phoneNumber.join(', ') : patient.phoneNumber} />
							<Info label='Sex' value={patient.sex} />
							<Info label='DOB' value={patient.dob} />
							<Info label='Address' value={patient.address} />
							<Info
								label='Aadhaar ID'
								value={patient.aadhaarId}
							/>
							<Info
								label='Ration Card'
								value={patient.rationCardColor}
							/>
						</div>

						{/* Right Column */}
						<div className='space-y-2'>
							<Info
								label='Assigned PHC'
								value={patient.assignedPhc}
							/>
							<Info
								label='Assigned Asha'
								value={patient.assignedAsha}
							/>
							<Info
								label='GPS Location'
								value={
									patient.gpsLocation
										? `Lat: ${patient.gpsLocation.lat}, Lng: ${patient.gpsLocation.lng}`
										: 'N/A'
								}
							/>
							{/* Diseases - Full width */}
							{(patient.diseases?.length ?? 0) > 0 && (
								<div className='md:col-span-2'>
									<p className='font-semibold mt-2'>
										Diseases:
									</p>
									<ul className='list-disc list-inside ml-4 mt-1'>
										{(patient.diseases ?? []).map(
											(disease, i) => (
												<li key={i}>{disease}</li>
											)
										)}
									</ul>
								</div>
							)}
						</div>

						{/* Follow Ups - Full width */}
						{(patient.followUps?.length ?? 0) > 0 && (
							<div className='md:col-span-2'>
								<p className='font-semibold mt-4'>
									Follow Ups:
								</p>
								<ul className='mt-2 space-y-3'>
									{(patient.followUps ?? []).map((f, i) => {
										const seconds = f.date?.seconds
										const readableDate = seconds
											? new Date(
													seconds * 1000
											  ).toLocaleDateString()
											: 'N/A'

										return (
											<li
												key={i}
												className='border border-border rounded-lg p-3 bg-muted/20'
											>
												<Info
													label='Date'
													value={readableDate}
												/>
												<Info
													label='Remarks'
													value={
														f.remarks ??
														'No remarks'
													}
												/>
												{f.notifyDoctor && (
													<Info
														label='Notify Doctor'
														value={f.notifyDoctor}
													/>
												)}
												{f.allotedAsha && (
													<Info
														label='Alloted Asha'
														value={f.allotedAsha}
													/>
												)}
											</li>
										)
									})}
								</ul>
							</div>
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}

function Info({ label, value }: { label: string; value?: string }) {
	return (
		<p>
			<span className='font-medium text-muted-foreground'>{label}:</span>{' '}
			<span>{value || 'N/A'}</span>
		</p>
	)
}
