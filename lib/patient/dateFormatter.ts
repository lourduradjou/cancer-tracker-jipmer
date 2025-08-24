export function formatDobToDDMMYYYY(dob: string) {
  if (!dob) return ''
  const [year, month, day] = dob.split('-')
  return `${day}-${month}-${year}`
}
