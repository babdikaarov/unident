import { createCalendarControlsPlugin } from '@unimed-x/calendar-controls'
import { CalendarCallbacks } from '@unimed-x/shared/src/interfaces/calendar/listeners.interface'

export const mainCalendatCallbacks = (
  control: ReturnType<typeof createCalendarControlsPlugin>
): CalendarCallbacks => ({
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
    // console.log(control.$app.calendarState.range.value)
  },

  onClickDateTime(dateTime) {
    console.log('onClickDateTime', dateTime)
    // console.log(control.$app.calendarState.range.value)
  },

  onClickAgendaDate(date) {
    console.log('onClickAgendaDate', date)
    // console.log(control.$app.calendarState.range.value)
  },

  onDoubleClickAgendaDate(date) {
    console.log('onDoubleClickAgendaDate', date)
  },

  onClickPlusEvents(date) {
    console.log('onClickPlusEvents', date)
  },

  onSelectedDateUpdate(date) {
    console.log('onSelectedDateUpdate', date)
    control.setDate(date)
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
})
