import { Timestamp } from "firebase/firestore"

// Firestore timestamp type
export type FirestoreTimestamp = {
	type: 'firestore/timestamp/1.0'
	seconds: number
	nanoseconds: number
}

export type FollowUp = {
	date?: Timestamp
	remarks?: string
	notifyDoctor?: string
	allotedAsha?: string
	lastUpdatedDate?: string
}

export type Patient = {
	id: string
	name: string
	phoneNumber?: string[]
	sex?: string
	dob?: string
	age?: string
	address?: string
	aadhaarId?: string
	rationCardColor?: string
	diseases?: string[]
	assignedPhc?: string
	assignedAsha?: string
	gpsLocation?: {
		lat: number
		lng: number
	}
	followUps?: FollowUp[]
	status?: string
	hasAadhaar?: boolean
	transferred?: boolean
}


