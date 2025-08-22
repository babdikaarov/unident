/* eslint-disable max-lines */
import '@fontsource/open-sans'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/500-italic.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/700-italic.css'
import '@fontsource/roboto-condensed'
import { createCalendar, toDateString } from '@unimed-x/calendar/src'
import '../../packages/theme-default/src/calendar.scss'
import '../app.css'
import { createDragAndDropPlugin } from '@unimed-x/drag-and-drop/src'
import { createEventModalPlugin } from '@unimed-x/event-modal/src'
import { seededEvents } from '../data/seeded-events.ts'
import { createScrollControllerPlugin } from '@unimed-x/scroll-controller/src'
import { createResizePlugin } from '@unimed-x/resize/src'
import {
  createEventRecurrencePlugin,
  createEventsServicePlugin,
} from '@unimed-x/event-recurrence/src'
import { createCalendarControlsPlugin } from '@unimed-x/calendar-controls/src'
import { createViewMonthGrid } from '@unimed-x/calendar/src/views/month-grid'
import { createViewWeek } from '@unimed-x/calendar/src/views/week'
import { createViewDay } from '@unimed-x/calendar/src/views/day'
import { createViewMonthAgenda } from '@unimed-x/calendar/src/views/month-agenda'
import { createViewList } from '@unimed-x/calendar/src/views/list'
import { translations, mergeLocales } from '@unimed-x/translations/src'
import { ZoomInPlugin } from '@unimed-x/zoom-in-out/src'
import { colors } from './colors.ts'
import { staffSeed } from '../data/staff-seed.ts'
import { StaffBase } from '@unimed-x/shared/src'
// import { createStaffServicePlugin } from '../../packages/staff-service/src'
import { createStaffServicePlugin } from '@unimed-x/staff-service/src'
// import { createStaffServicePlugin } from '../../packages/staff-service/src/staff-service-plugin.impl.ts'

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

const calendar = createCalendar({
  // staff: [],
  // staff: staffSeed,
  staff: staffSeed,
  // events: [],
  staffPerViewWeek: 10,
  events: seededEvents,
  // isLoading: true,
  staffPerView: 20,
  // showDayNumber: false,
  // isLoading: true,
  // hasStaffList: false,
  hasStaffList: true,
  showCurrentTimeIndicator: true,
  // events: seededEvents,

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
    // new ZoomInPlugin(calendarControls, {
    //   zoomFactor: 1, // Initial zoom (default: 1)
    //   minZoom: 1, // Minimum zoom (default: 0.5)
    //   maxZoom: 6, // Maximum zoom (default: 2)
    //   zoomStep: 0.05, // Step per scroll (default: 0.2)
    //   baseGridHeight: 1200, // Base height in px (default: 900)
    // }),
  ],

  translations: mergeLocales(translations, {
    enUS: {},
  }),
  // weekOptions: {
  //   eventWidth: 95,
  // },
  minuteBoudaries: 60,
  weekOptions: {
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
    eventOverlap: false,
    gridHeight: 1950,
  },
  firstDayOfWeek: 1,
  views: [
    createViewMonthGrid(),
    createViewWeek(),
    createViewDay(),
    createViewMonthAgenda(),
    createViewList(),
  ],

  defaultView: 'week',
  callbacks: {
    beforeRender($app) {
      calendarControls.beforeRender($app)
      eventsServicePlugin.beforeRender($app)
      staffService.beforeRender($app)
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
    // onClickDateTime(dateTime, _e, staff) {
    //   console.log(dateTime, staff)
    // },
    onClickFiveMinuteRange(dateTime, _e, staff) {
      console.log(dateTime, staff)
    },
  },
  selectedDate: toDateString(new Date()),
  calendars: colors,
  // dayBoundaries: {
  //   start: '07:00',
  //   end: '23:00',
  // },

  locale: 'ru-RU',
})
calendar._setCustomComponentFn('weekGridDateStaff', (el, data) => {
  console.log(el, data)
  // Manipulate the DOM element directly
  el.innerHTML = `<div>Custom date: ${data.date}</div>`
  // Or add classes, event listeners, etc.
  el.classList.add('custom-styling')
})
calendar.render(calendarElement)
