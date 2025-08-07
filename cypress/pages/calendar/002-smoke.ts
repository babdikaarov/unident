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
import { createResizePlugin } from '../../../packages/resize/src'
import { smokeTestEvents } from './__data__/smoke-data.ts'
import { createScrollControllerPlugin } from '../../../packages/scroll-controller/src'

const calendarElement = document.getElementById('calendar') as HTMLElement

const calendar = createCalendar({
  selectedDate: '2023-09-21',
  locale: 'en-US',
  views: [viewWeek, viewMonthGrid, viewMonthAgenda, viewDay],
  defaultView: 'week',
  plugins: [
    createDragAndDropPlugin(),
    createEventModalPlugin(),
    createScrollControllerPlugin(),
    createResizePlugin(),
  ],
  events: smokeTestEvents,
})

calendar.render(calendarElement)
