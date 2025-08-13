import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'
import { toDateTimeString } from '@unimed-x/shared/src/utils/stateless/time/format-conversion/date-to-strings'
import { toJSDate } from '@unimed-x/shared/src/utils/stateless/time/format-conversion/format-conversion'
import { addTimePointsToDateTime } from '@unimed-x/shared/src/utils/stateless/time/time-points/string-conversion'

export const getClickDateTime = (
  e: MouseEvent,
  $app: CalendarAppSingleton,
  dayStartDateTime: string
) => {
  if (!(e.target instanceof HTMLElement)) return

  const DAY_GRID_CLASS_NAME = 'sx__time-grid-day'
  const dayGridElement = e.target.classList.contains(DAY_GRID_CLASS_NAME)
    ? e.target
    : (e.target.closest('.' + DAY_GRID_CLASS_NAME) as HTMLDivElement)

  const clientY = e.clientY - dayGridElement.getBoundingClientRect().top
  const clickPercentageOfDay =
    (clientY / dayGridElement.getBoundingClientRect().height) * 100
  const clickTimePointsIntoDay = Math.round(
    ($app.config.timePointsPerDay / 100) * clickPercentageOfDay
  )

  return addTimePointsToDateTime(dayStartDateTime, clickTimePointsIntoDay)
}
export const roundMinutesToNearest5 = (dateTimeString: string): string => {
  const jsDate = toJSDate(dateTimeString) // convert string to Date
  const minutes = jsDate.getMinutes()

  // Round down to nearest multiple of 5
  const rounded = Math.floor(minutes / 5) * 5
  jsDate.setMinutes(rounded)
  jsDate.setSeconds(0)
  jsDate.setMilliseconds(0)

  return toDateTimeString(jsDate)
}
