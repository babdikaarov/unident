import { PreactViewComponent } from '@unimed-x/shared/src/types/calendar/preact-view-component'
import TimeGridDay from '../../../components/week-grid/time-grid-day'
import TimeAxis from '../../../components/week-grid/time-axis'
import { AppContext } from '../../../utils/stateful/app-context'
import DateAxis from '../../../components/week-grid/date-axis'
import { toJSDate } from '@unimed-x/shared/src/utils/stateless/time/format-conversion/format-conversion'
import { sortEventsForWeekView } from '../../../utils/stateless/events/sort-events-for-week'
import { createWeek } from '../../../utils/stateless/views/week/create-week'
import { positionInTimeGrid } from '../../../utils/stateless/events/position-in-time-grid'
import { positionInDateGrid } from '../../../utils/stateless/events/position-in-date-grid'
import { sortEventsByStartAndEnd } from '../../../utils/stateless/events/sort-by-start-date'
import DateGridDay from '../../../components/week-grid/date-grid-day'
import { useComputed } from '@preact/signals'
import { filterByRange } from '../../../utils/stateless/events/filter-by-range'
import Chevron from '@unimed-x/shared/src/components/buttons/chevron'
import { useEffect, useState } from 'preact/hooks'
import { getElementByCCID } from '../../../utils/stateless/dom/getters'
import { randomStringId } from '@unimed-x/shared/src'
import TimeGridCurrentTimeIndicator from '../../../components/week-grid/time-grid-current-indicator'
import TimeGridWeekWithStaff from '../../../components/week-grid/time-grid-week-with-staff'
import DateAxisWeekStaff from '../../../components/week-grid/date-axis-week-staff'

export const WeekWrapper: PreactViewComponent = ({ $app, id }) => {
  document.documentElement.style.setProperty(
    '--sx-week-grid-height',
    `${$app.config.weekOptions.value.gridHeight}px`
  )
  const timeGridDayStaffConent =
    $app.config._customComponentFns.timeGridDayStaffConent

  const noStaffFound = $app.config._customComponentFns.noStaffFound

  const noStaffFoundId = useState(
    noStaffFound ? randomStringId() : undefined
  )[0]

  const week = useComputed(() => {
    const rangeStart = $app.calendarState.range.value?.start
    const rangeEnd = $app.calendarState.range.value?.end
    if (!rangeStart || !rangeEnd) return {}

    let newWeek = createWeek($app)
    const filteredEvents = $app.calendarEvents.filterPredicate.value
      ? $app.calendarEvents.list.value.filter(
          $app.calendarEvents.filterPredicate.value
        )
      : $app.calendarEvents.list.value
    const { dateGridEvents, timeGridEvents } =
      sortEventsForWeekView(filteredEvents)
    newWeek = positionInDateGrid(
      dateGridEvents.sort(sortEventsByStartAndEnd),
      newWeek
    )
    Object.entries(newWeek).forEach(([date, day]) => {
      day.backgroundEvents = filterByRange(
        $app.calendarEvents.backgroundEvents.value,
        {
          start: date,
          end: date,
        }
      )
    })
    newWeek = positionInTimeGrid(timeGridEvents, newWeek, $app)
    return newWeek
  })

  useEffect(() => {
    if (timeGridDayStaffConent) {
      $app.staffList.getStaffListOnView().forEach((staff) => {
        timeGridDayStaffConent(getElementByCCID(staff.id), { staff })
      })
    }
    if (noStaffFound) {
      noStaffFound(getElementByCCID(noStaffFoundId), { $app })
    }
  }, [$app.staffList, $app.staffList.getStaffListOnView()])
  return (
    <>
      <AppContext.Provider value={$app}>
        {$app.config.isLoading.value ? (
          <div className="sx_spinner"></div>
        ) : (
          <div className="sx__week-wrapper" id={id}>
            <div className="sx__week-header">
              <div className="sx__week-header-content">
                {$app.config.hasStaffList.value ? null : (
                  <DateAxis
                    week={Object.values(week.value).map((day) =>
                      toJSDate(day.date)
                    )}
                  />
                )}

                {!$app.config.hasStaffList.value ||
                $app.calendarState.view.value !== 'week' ? (
                  <div
                    className="sx__date-grid"
                    aria-label={$app.translate(
                      'Full day- and multiple day events'
                    )}
                  >
                    {Object.values(week.value).map((day) => (
                      <DateGridDay
                        key={day.date}
                        date={day.date}
                        calendarEvents={day.dateGridEvents}
                        backgroundEvents={day.backgroundEvents}
                      />
                    ))}
                  </div>
                ) : $app.staffList.hasList.value ? (
                  <div className="sx__time-grid-day-staff-wrapper">
                    <>
                      <Chevron
                        className="sx__time-grid-day-staff-prev"
                        direction="previous"
                        disabled={!$app.staffList.canNavigatePrev()}
                        onClick={$app.staffList.prev}
                      />
                      <div className="sx__time-grid-day-staff-card">
                        {$app.staffList
                          .getStaffListOnViewWeek()
                          .map((staff) => {
                            return (
                              <div className="sx__time-grid-day-staff-card-inner-wrapper">
                                <div
                                  className="sx__time-grid-day-staff"
                                  key={staff.id}
                                  data-ccid={staff.id}
                                >
                                  {!timeGridDayStaffConent && staff.firstName}
                                </div>
                                <DateAxisWeekStaff
                                  week={Object.values(week.value).map((day) =>
                                    toJSDate(day.date)
                                  )}
                                />
                              </div>
                            )
                          })}
                      </div>
                      <Chevron
                        className="sx__time-grid-day-staff-next"
                        direction="next"
                        disabled={!$app.staffList.canNavigateNext()}
                        onClick={$app.staffList.next}
                      />
                    </>
                  </div>
                ) : (
                  <div
                    className="sx__time-grid-day-staff-wrapper"
                    data-ccid={noStaffFoundId}
                  >
                    {!noStaffFound && 'no staff privided'}
                  </div>
                )}
                <div className="sx__week-header-border" />
              </div>
            </div>

            <div className="sx__week-grid">
              <TimeAxis />
              {!$app.config.hasStaffList.value ||
              $app.calendarState.view.value !== 'week' ? (
                Object.values(week.value).map((day) => (
                  <>
                    <TimeGridDay
                      calendarEvents={day.timeGridEvents}
                      backgroundEvents={day.backgroundEvents}
                      date={day.date}
                      key={day.date}
                    />
                  </>
                ))
              ) : (
                <div className="sx__week-grid-staff">
                  {$app.staffList.getStaffListOnViewWeek().map((staff) => {
                    return Object.values(week.value).map((day) => (
                      <>
                        <TimeGridCurrentTimeIndicator
                          $app={$app}
                          date={day.date}
                        />
                        <TimeGridWeekWithStaff
                          staff={staff}
                          calendarEvents={day.timeGridEvents}
                          backgroundEvents={day.backgroundEvents}
                          date={day.date}
                          key={day.date}
                        />
                      </>
                    ))
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </AppContext.Provider>
    </>
  )
}
