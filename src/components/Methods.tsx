export function durationToMinutes(duration: string): number {
  if (!duration) {
    return 0
  }
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/
  const match = duration.match(regex)

  if (!match) {
    throw new Error("Invalid duration format")
  }

  const hours = match[1] ? parseInt(match[1], 10) : 0
  const minutes = match[2] ? parseInt(match[2], 10) : 0

  return hours * 60 + minutes
}

export function formatMinutesToHourMinute(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return (
    hours > 0
      ? `${hours} hr `
      : ''
  ) + `${minutes.toString().padStart(2, "0")} min`
}

export function formatDuration(duration: string): string {
  return formatMinutesToHourMinute(durationToMinutes(duration))
}

export function formatSentences(text: string): string {
  if (!text) {
    return ''
  }
  return text
    .split(/([.!?]\s+)/) // keep punctuation + space
    .map(sentence =>
      sentence.length > 0
        ? sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
        : sentence
    )
    .join("")
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
