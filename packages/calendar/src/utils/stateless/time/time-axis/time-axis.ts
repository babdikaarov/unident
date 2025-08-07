import { DayBoundariesInternal } from '@unimed-x/shared/src/types/calendar/day-boundaries'

export const getTimeAxisHours = (
  { start, end }: DayBoundariesInternal,
  isHybridDay: boolean
) => {
  const hours: number[] = []
  let hour = Math.floor(start / 100)

  if (isHybridDay) {
    while (hour < 24) {
      hours.push(hour)
      hour += 1
    }

    hour = 0
  }

  const lastHour = end === 0 ? 24 : Math.ceil(end / 100)
  while (hour < lastHour) {
    hours.push(hour)
    hour += 1
  }

  return hours
}

/**
 * Returns an array of interval indices for an hour based on the interval length in minutes.
 *
 * @param intervalMinutes - number of minutes per interval (e.g., 5)
 * @returns number[] - array of indices from 0 to count-1
 */
export const getIntervalsPerHour = (
  intervalMinutes: number
): {
  array: number[]
  minute: number
} => {
  const count = Math.floor(60 / intervalMinutes)
  document.documentElement.style.setProperty(
    '--sx-minute-interval',
    count.toString()
  )
  return {
    array: Array.from({ length: count }, (_, i) => i),
    minute: intervalMinutes,
  }
}
