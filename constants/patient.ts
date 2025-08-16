export const patientFields = [
    { label: 'Name', key: 'name' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Sex', key: 'sex' },
    { label: 'Date of Birth', key: 'dob' },
    { label: 'Age', key: 'age' },
    { label: 'Address', key: 'address' },
    { label: 'Aadhaar ID', key: 'aadhaarId' },
    { label: 'Ration Card Color', key: 'rationCardColor' },
    { label: 'Diseases', key: 'diseases' }, // Note: This is an array, will need special rendering
    { label: 'Assigned Hospital ID', key: 'assignedHospitalId' },
    { label: 'Assigned Hospital Name', key: 'assignedHospitalName' },
    { label: 'Assigned Asha', key: 'assignedAsha' },
    { label: 'GPS Location', key: 'gpsLocation' }, // Note: This is an object, will need special rendering
    { label: 'Follow Ups', key: 'followUps' }, // Note: This is an array of objects, will need special rendering
    { label: 'Status', key: 'status' },
    { label: 'Aabha ID', key: 'aabhaId' },
    { label: 'Diagnosed Date', key: 'diagnosedDate' },
    { label: 'Diagnosed Years Ago', key: 'diagnosedYearsAgo' },
    { label: 'Insurance Type', key: 'insurance' }, // Note: This is a nested object and will need special rendering or pre-processing
]
