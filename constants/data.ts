export const AVAILABLE_DISEASES_LIST = {
    solid: [
        { label: 'Breast cancer', gender: 'female' }, // Added gender
        { label: 'Lung cancer', gender: undefined },
        { label: 'Oral cavity (mouth) cancer', gender: undefined },
        { label: 'Cervix cancer', gender: 'female' }, // Added gender
        { label: 'Prostate cancer', gender: 'male' }, // Added gender
        { label: 'Tongue cancer', gender: undefined },
        { label: 'Stomach cancer', gender: undefined },
        { label: 'Ovary cancer', gender: 'female' }, // Added gender
        { label: 'Liver cancer', gender: undefined },
        { label: 'Uterus cancer', gender: 'female' }, // Added gender
        { label: 'Gallbladder cancer', gender: undefined },
        { label: 'Oesophagus cancer', gender: undefined },
        { label: 'Thyroid cancer', gender: undefined },
        { label: 'Colorectal cancer', gender: undefined },
    ],
    blood: [
        { label: 'Non-Hodgkin lymphoma cancer', gender: undefined },
        { label: 'Leukemia cancer', gender: undefined },
    ],
}

export const PATIENT_TABLE_HEADERS = [
    {
        name: 'Patient Name',
        key: 'name',
    },
    {
        name: 'Phone',
        key: 'phoneNumber',
    },
    {
        name: 'Sex',
        key: 'sex',
    },
    {
        name: 'Age',
        key: 'dob',
    },
    {
        name: 'Status',
        key: 'status',
    },
]

export const DOCTOR_TABLE_HEADERS = [
    {
        name: 'Doctor Name',
        key: 'name',
    },
    {
        name: 'Phone',
        key: 'phoneNumber',
    },
    {
        name: 'Sex',
        key: 'sex',
    },
    {
        name: 'Age',
        key: 'age',
    },
    {
        name: 'Org Name',
        key: 'orgName',
    },
]


export const NURSES_TABLE_HEADERS = [
    {
        name: 'Nurse Name',
        key: 'name',
    },
    {
        name: 'Phone',
        key: 'phoneNumber',
    },
    {
        name: 'Sex',
        key: 'sex',
    },
    {
        name: 'Age',
        key: 'age',
    },
    {
        name: 'Org Name',
        key: 'orgName',
    },
]


export const ASHA_TABLE_HEADERS = [
    {
        name: 'Asha Name',
        key: 'name',
    },
    {
        name: 'Phone',
        key: 'phoneNumber',
    },
    {
        name: 'Sex',
        key: 'sex',
    },
    {
        name: 'Age',
        key: 'dob',
    },
    {
        name: 'Org Name',
        key: 'orgName',
    },
]

export const HOSPITAL_TABLE_HEADERS = [
    {
        name: 'Hospital Name',
        key: 'name',
    },
    {
        name: 'Contact Number',
        key: 'phoneNumber',
    },
    {
        name: 'Address',
        key: 'address',
    },
]


