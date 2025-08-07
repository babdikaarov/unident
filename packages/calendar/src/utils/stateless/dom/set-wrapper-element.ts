import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'

export const setWrapperElement = (
  $app: CalendarAppSingleton,
  calendarId: string
) => {
  $app.elements.calendarWrapper = document.getElementById(
    calendarId
  ) as HTMLDivElement
}
