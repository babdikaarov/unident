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
// import { createDragAndDropPlugin } from '@unimed-x/drag-and-drop/src'
import { createEventModalPlugin } from '@unimed-x/event-modal/src'
import { seededEvents } from '../data/seeded-events.ts'
import { createScrollControllerPlugin } from '@unimed-x/scroll-controller/src'
import { createResizePlugin } from '../../packages/resize/src'
import {
  createEventRecurrencePlugin,
  createEventsServicePlugin,
} from '@unimed-x/event-recurrence/src'
import { createCalendarControlsPlugin } from '../../packages/calendar-controls/src'
import { createCurrentTimePlugin } from '../../packages/current-time/src/current-time-plugin.impl.ts'
import { createViewMonthGrid } from '@unimed-x/calendar/src/views/month-grid'
import { createViewWeek } from '@unimed-x/calendar/src/views/week'
import { createViewDay } from '@unimed-x/calendar/src/views/day'
import { createViewMonthAgenda } from '@unimed-x/calendar/src/views/month-agenda'
import { createViewList } from '@unimed-x/calendar/src/views/list'
import { mergeLocales } from '@unimed-x/translations/src/utils/merge-locales.ts'
import { translations } from '@unimed-x/translations/src'
import { ZoomInPlugin } from '../../packages/zoom-in-out/src/index.ts'
import { createDragAndDropPlugin } from '@unimed-x/drag-and-drop'
import { staffSeed } from '../data/staff-seed.ts'
// import { CopyEventPlugin } from '@starredev/schedule-x-plugins'
// import { ZoomInPlugin } from '@starredev/schedule-x-plugins'
const calendarElement = document.getElementById('calendar') as HTMLElement
const calendarSiderElement = document.getElementById(
  'siderCalendar'
) as HTMLElement
const calendarControls = createCalendarControlsPlugin()
// const eventModalPlugin = createEventModalPlugin()
const eventsServicePlugin = createEventsServicePlugin()

const sidebarCalendar = createCalendar({
  views: [createViewMonthAgenda()],
  events: seededEvents,
  defaultView: 'monthly-agenda',
  locale: 'ru-RU',
  plugins: [],
  callbacks: {
    // Disable interactions in the sidebar
    onClickDate() {},
    onClickDateTime() {},
    onEventClick() {},
    onDoubleClickDate() {},
    onDoubleClickDateTime() {},
    onDoubleClickEvent() {},
    onSelectedDateUpdate(date) {
      console.log('onSelectedDateUpdate', date)
      calendarControls.setDate(date)
      // calendarControls.$app.config.minuteBoudaries.value = 10
    },
  },
  calendars: {
    abcent: {
      colorName: 'abcent',
      lightColors: {
        main: '#f9d71c',
        container: '#fff5aa',
        onContainer: '#594800',
      },
      darkColors: {
        main: '#fff5c0',
        onContainer: '#fff5de',
        container: '#a29742',
      },
    },
    canceled: {
      colorName: 'canceled',
      lightColors: {
        main: '#f91c45',
        container: '#ffd2dc',
        onContainer: '#59000d',
      },
      darkColors: {
        main: '#ffc0cc',
        onContainer: '#ffdee6',
        container: '#a24258',
      },
    },
    success: {
      colorName: 'success',
      lightColors: {
        main: '#1cf9b0',
        container: '#dafff0',
        onContainer: '#004d3d',
      },
      darkColors: {
        main: '#c0fff5',
        onContainer: '#e6fff5',
        container: '#42a297',
      },
    },
    confirmed: {
      colorName: 'confirmed',
      lightColors: {
        main: '#1c7df9',
        container: '#d2e7ff',
        onContainer: '#002859',
      },
      darkColors: {
        main: '#c0dfff',
        onContainer: '#dee6ff',
        container: '#426aa2',
      },
    },
  },
})

const calendar = createCalendar({
  staff: staffSeed,
  minuteBoudaries: 30,
  plugins: [
    createViewMonthAgenda(),
    createEventRecurrencePlugin(),
    // createDragAndDropPlugin(),
    createCurrentTimePlugin(),
    createEventModalPlugin(),
    // createResizePlugin(),
    createScrollControllerPlugin(),
    eventsServicePlugin,
    // new CopyEventPlugin(eventsServicePlugin, (event) => {
    //   console.log('CopyEventPlugin', event)
    //   eventsServicePlugin.add(event)
    // }),
    calendarControls,
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
    onScrollDayIntoView(date) {
      console.log('onScrollDayIntoView: ', date)
    },

    onEventUpdate(event) {
      console.log('onEventUpdate', event)
    },

    async onBeforeEventUpdateAsync(oldEvent, newEvent, $app) {
      return Promise.resolve(true)
    },

    onEventClick(event, e) {
      console.log('onEventClick', event, e)
    },

    onDoubleClickEvent(event, e) {
      console.log('onDoubleClickEvent', event, e)
    },

    onClickDate(date) {
      console.log('onClickDate', date)
      console.log(calendarControls.$app.calendarState.range.value)
    },

    onClickDateTime(dateTime) {
      console.log('onClickDateTime', dateTime)
      console.log(calendarControls.$app.calendarState.range.value)
    },

    onClickAgendaDate(date) {
      console.log('onClickAgendaDate', date)
      console.log(calendarControls.$app.calendarState.range.value)
    },

    onDoubleClickAgendaDate(date) {
      console.log('onDoubleClickAgendaDate', date)
    },

    onClickPlusEvents(date) {
      console.log('onClickPlusEvents', date)
    },

    onSelectedDateUpdate(date) {
      console.log('onSelectedDateUpdate', date)
    },

    onDoubleClickDateTime(dateTime) {
      console.log('onDoubleClickDateTime', dateTime)
    },

    onDoubleClickDate(date) {
      console.log('onDoubleClickDate', date)
    },

    onRangeUpdate(range) {
      console.log('onRangeUpdate', range)
    },
  },
  selectedDate: '2025-08-06',
  calendars: {
    abcent: {
      colorName: 'abcent',
      lightColors: {
        main: '#f9d71c',
        container: '#fff5aa',
        onContainer: '#594800',
      },
      darkColors: {
        main: '#fff5c0',
        onContainer: '#fff5de',
        container: '#a29742',
      },
    },
    canceled: {
      colorName: 'canceled',
      lightColors: {
        main: '#f91c45',
        container: '#ffd2dc',
        onContainer: '#59000d',
      },
      darkColors: {
        main: '#ffc0cc',
        onContainer: '#ffdee6',
        container: '#a24258',
      },
    },
    success: {
      colorName: 'success',
      lightColors: {
        main: '#1cf9b0',
        container: '#dafff0',
        onContainer: '#004d3d',
      },
      darkColors: {
        main: '#c0fff5',
        onContainer: '#e6fff5',
        container: '#42a297',
      },
    },
    confirmed: {
      colorName: 'confirmed',
      lightColors: {
        main: '#1c7df9',
        container: '#d2e7ff',
        onContainer: '#002859',
      },
      darkColors: {
        main: '#c0dfff',
        onContainer: '#dee6ff',
        container: '#426aa2',
      },
    },
  },
  dayBoundaries: {
    start: '07:00',
    end: '24:00',
  },

  locale: 'ru-RU',
  events: seededEvents,
})
calendar.render(calendarElement)
sidebarCalendar.render(calendarSiderElement)
