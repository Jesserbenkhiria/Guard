import { format, parse, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr })
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM', { locale: fr })
}

export function formatAgentName(lastName: string, firstName: string): string {
  return `${lastName} ${firstName}`
}

export function parseTime(time: string): number {
  const parsed = parse(time, 'HH:mm', new Date())
  return parsed.getHours() * 60 + parsed.getMinutes()
}

export function getShiftDurationMinutes(startTime: string, endTime: string): number {
  const start = parseTime(startTime)
  let end = parseTime(endTime)
  if (end <= start) end += 24 * 60
  return end - start
}

export function getShiftDurationHours(startTime: string, endTime: string): number {
  return getShiftDurationMinutes(startTime, endTime) / 60
}

export function isNightShift(startTime: string, endTime: string): boolean {
  const start = parseTime(startTime)
  const end = parseTime(endTime)
  return start >= 18 * 60 || end <= 7 * 60 || end < start
}

export function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const toRanges = (s: string, e: string) => {
    const start = parseTime(s)
    let end = parseTime(e)
    if (end <= start) {
      return [
        [start, 24 * 60],
        [0, end],
      ]
    }
    return [[start, end]]
  }

  const ranges1 = toRanges(start1, end1)
  const ranges2 = toRanges(start2, end2)

  return ranges1.some(([s1, e1]) =>
    ranges2.some(([s2, e2]) => s1 < e2 && s2 < e1),
  )
}

export function isDateInVacation(date: string, vacations: { start: string; end: string }[]): boolean {
  const d = parseISO(date)
  return vacations.some((v) => {
    const start = parseISO(v.start)
    const end = parseISO(v.end)
    return d >= start && d <= end
  })
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
