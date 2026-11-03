export function fmt(d: string | Date | null | undefined): string {
  if (!d) return '-'
  const date = new Date(d)
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
