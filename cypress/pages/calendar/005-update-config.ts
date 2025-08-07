import '@fontsource/open-sans'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/500-italic.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/700-italic.css'
import '@fontsource/roboto-condensed'
import {
  createCalendar,
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from '../../../packages/calendar/src'
import '../../../packages/theme-default/dist/index.css'
import '../index.css'
import { createDragAndDropPlugin } from '../../../packages/drag-and-drop/src'
import { createEventModalPlugin } from '../../../packages/event-modal/src'
import { createCalendarControlsPlugin } from '../../../packages/calendar-controls/src'

const calendarElement = document.getElementById('calendar') as HTMLElement

const calendarControls = createCalendarControlsPlugin()
const calendar = createCalendar({
  selectedDate: '2023-09-21',
  locale: 'en-US',
  views: [viewWeek, viewMonthGrid, viewMonthAgenda, viewDay],
  defaultView: 'week',
  plugins: [
    createDragAndDropPlugin(),
    createEventModalPlugin(),
    calendarControls,
  ],
  events: [],
})

calendar.render(calendarElement)

const setNDaysButton = document.getElementById(
  'set-n-days-5'
) as HTMLButtonElement
setNDaysButton.addEventListener('click', () => {
  calendarControls.setWeekOptions({
    ...calendarControls.getWeekOptions(),
    nDays: 5,
  })
})

const setFirstDayOfWeek = document.getElementById(
  'set-first-day-of-week-2'
) as HTMLButtonElement
setFirstDayOfWeek.addEventListener('click', () => {
  calendarControls.setFirstDayOfWeek(2)
})

const setGermanLocale = document.getElementById(
  'set-german'
) as HTMLButtonElement
setGermanLocale.addEventListener('click', () => {
  calendarControls.setLocale('de-DE')
})
