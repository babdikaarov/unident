/* eslint-disable max-lines */
import '@fontsource/open-sans'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/500-italic.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/700-italic.css'
import '@fontsource/roboto-condensed'
import { createCalendar } from '@unimed-x/calendar/src'
import '../../packages/theme-default/src/calendar.scss'
import '../app.css'
import { createDragAndDropPlugin } from '@unimed-x/drag-and-drop/src'
import { createEventModalPlugin } from '@unimed-x/event-modal/src'
import { seededEvents } from '../data/seeded-events.ts'
import { createScrollControllerPlugin } from '@unimed-x/scroll-controller/src'
import { createResizePlugin } from '../../packages/resize/src'
import {
  createEventRecurrencePlugin,
  createEventsServicePlugin,
} from '@unimed-x/event-recurrence/src'
import { createCalendarControlsPlugin } from '../../packages/calendar-controls/src'
import { createViewMonthGrid } from '@unimed-x/calendar/src/views/month-grid'
import { createViewWeek } from '@unimed-x/calendar/src/views/week'
import { createViewDay } from '@unimed-x/calendar/src/views/day'
import { createViewMonthAgenda } from '@unimed-x/calendar/src/views/month-agenda'
import { createViewList } from '@unimed-x/calendar/src/views/list'
import { mergeLocales } from '@unimed-x/translations/src/utils/merge-locales.ts'
import { translations } from '@unimed-x/translations/src'
import { ZoomInPlugin } from '../../packages/zoom-in-out/src/index.ts'
// import { createDragAndDropPlugin } from '@unimed-x/drag-and-drop'
import { colors } from './colors.ts'
import { StaffBase, toDateString } from '@unimed-x/shared'
import { createStaffServicePlugin } from '../../packages/staff-service/dist/core.js'
import { staffSeed } from '../data/staff-seed.ts'
const calendarElement = document.getElementById('calendar') as HTMLElement
const calendarSiderElement = document.getElementById(
  'siderCalendar'
) as HTMLElement
const calendarControls = createCalendarControlsPlugin()
// const eventModalPlugin = createEventModalPlugin()
const staffService = createStaffServicePlugin()
const eventsServicePlugin = createEventsServicePlugin()
const fetchStaff = async () => {
  try {
    const res = await fetch(
      'https://api-dev.unimedx.ai/api/v1/staff-profiles?clinicId=8d3d0863-df4d-4ada-8cc0-1ba6adf019ec'
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data: { content: StaffBase[] } = await res.json()
    return data.content // Assuming this is an array of staff
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return []
  }
}
const sidebarCalendar = createCalendar({
  views: [createViewMonthAgenda()],
  // events: [],
  events: seededEvents,
  defaultView: 'monthly-agenda',
  locale: 'ru-RU',
  // plugins: [calendarControls],
  callbacks: {
    // Disable interactions in the sidebar
    onClickDate() {},
    onClickDateTime() {},
    onEventClick() {},
    onDoubleClickDate() {},
    onDoubleClickDateTime() {},
    onDoubleClickEvent() {},
    onSelectedDateUpdate(date) {
      console.log(date)
      calendarControls.setDate(date)
    },
  },

  calendars: colors,
})
const calendar = createCalendar({
  // staff: [],
  staff: staffSeed,
  // events: [],
  events: seededEvents,
  // isLoading: true,
  staffPerView: 7,
  // isLoading: true,
  hasStaffList: true,
  showCurrentTimeIndicator: true,
  // events: seededEvents,
  minuteBoudaries: 60,
  plugins: [
    createViewMonthAgenda(),
    createEventRecurrencePlugin(),
    createDragAndDropPlugin(),

    createEventModalPlugin(),
    createResizePlugin(),
    createScrollControllerPlugin(),
    eventsServicePlugin,
    calendarControls,
    staffService,
    new ZoomInPlugin(calendarControls, {
      zoomFactor: 1, // Initial zoom (default: 1)
      minZoom: 1, // Minimum zoom (default: 0.5)
      maxZoom: 6, // Maximum zoom (default: 2)
      zoomStep: 0.05, // Step per scroll (default: 0.2)
      baseGridHeight: 1200, // Base height in px (default: 900)
    }),
  ],

  translations: mergeLocales(translations, {
    enUS: {},
  }),
  weekOptions: {
    eventWidth: 95,
  },
  firstDayOfWeek: 1,
  views: [
    createViewMonthGrid(),
    createViewWeek(),
    createViewDay(),
    createViewMonthAgenda(),
    createViewList(),
  ],

  defaultView: 'day',
  callbacks: {
    beforeRender($app) {
      // fetchStaff().then((staffData) => {
      //   // $app.staffList.setStaffList(staffData)
      //   $app.staffList.setStaffList([...staffData, ...staffSeed])
      //   setTimeout(() => {
      //     $app.config.isLoading.value = false
      //   }, 1000)
      // })
    },
    onEventClick(event, e) {
      console.log(event)
    },
    onClickDateTime(dateTime, _e, staff) {
      console.log(dateTime, staff)
    },
  },
  selectedDate: toDateString(new Date()),
  calendars: colors,
  // dayBoundaries: {
  //   start: '07:00',
  //   end: '24:00',
  // },

  locale: 'ru-RU',
})
calendar.render(calendarElement)

sidebarCalendar.render(calendarSiderElement)
