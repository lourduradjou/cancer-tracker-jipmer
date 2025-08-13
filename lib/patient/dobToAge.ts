const checkDateValidation = (dob: string | undefined, today: Date): Date | string => {
    if (!dob) return 'N/A'

    const [day, month, year] = dob.split('-').map(Number)
    if (!day || !month || !year) return 'Invalid date'

    // Basic range checks
    if (month < 1 || month > 12 || day < 1 || year > today.getFullYear()) return 'Invalid date'

    // Leap-year-aware days in month
    const daysInMonth = new Date(year, month, 0).getDate()
    if (day > daysInMonth) return 'Invalid date'

    const birthDate = new Date(year, month - 1, day)

    // Reject auto-corrected dates (e.g., 31 April -> 1 May)
    if (
        birthDate.getDate() !== day ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getFullYear() !== year
    ) {
        return 'Invalid date'
    }

    // No future dates
    if (birthDate > today) return 'Invalid date'

    return birthDate
}

export const dobToAgeUtil = (dob?: string): string => {
    const today = new Date()
    const birthDate = checkDateValidation(dob, today)
    if (typeof birthDate === 'string') return birthDate

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (days < 0) {
        months--
        const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
        days += prevMonthDays
    }

    if (months < 0) {
        years--
        months += 12
    }

    if (years >= 1) return `${years} yrs`
    if (months >= 1) return `${months} month${months > 1 ? 's' : ''}`
    return '<1 month'
}
