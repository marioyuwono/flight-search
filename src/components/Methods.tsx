export function durationToMinutes(duration: string): number {
  const hours = parseInt(duration[1]) || 0
  const minutes = parseInt(duration[2]) || 0
  return hours * 60 + minutes
}

export function normalizeDateAsString(date: Date|string): string {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  return (
    date.getFullYear()
    + "-"
    + String(date.getMonth() + 1).padStart(2, "0")
    + "-"
    + String(date.getDate()).padStart(2, "0")
  )
}

export function join(items: string[]): string {
  if (items.length == 0) {
    return ''
  } else if (items.length == 1) {
    return items[0]
  } else {
    const glue = items.length > 2 ? ', and ' : ' and '
    return items.slice(0, -1).join(', ') + glue + items.slice(-1)[0]
  }
}
