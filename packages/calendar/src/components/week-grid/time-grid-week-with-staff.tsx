import { CalendarEventInternal } from '@unimed-x/shared/src/interfaces/calendar/calendar-event.interface'
import { useContext, useState, useMemo } from 'preact/hooks'
import { AppContext } from '../../utils/stateful/app-context'
import TimeGridEvent from './time-grid-event'
import { sortEventsByStartAndEnd } from '../../utils/stateless/events/sort-by-start-date'
import { handleEventConcurrency } from '../../utils/stateless/events/event-concurrency'
import { timeStringFromTimePoints } from '@unimed-x/shared/src/utils/stateless/time/time-points/string-conversion'
import { setTimeInDateTimeString } from '@unimed-x/shared/src/utils/stateless/time/date-time-mutation/date-time-mutation'
import { addDays } from '@unimed-x/shared/src/utils/stateless/time/date-time-mutation/adding'
import { DayBoundariesDateTime } from '@unimed-x/shared/src/types/day-boundaries-date-time'
import {
  getClickDateTime,
  roundMinutesToNearest5,
} from '../../utils/stateless/time/grid-click-to-datetime/grid-click-to-datetime'
import { getLocalizedDate } from '@unimed-x/shared/src/utils/stateless/time/date-time-localization/get-time-stamp'
import { getClassNameForWeekday } from '../../utils/stateless/get-class-name-for-weekday'
import { toJSDate } from '@unimed-x/shared/src'
import TimeGridBackgroundEvent from './background-event'
import { BackgroundEvent } from '@unimed-x/shared/src/interfaces/calendar/background-event'
import { ReadonlySignal, useComputed, useSignalEffect } from '@preact/signals'
import { StaffBase } from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'
import { getTimeAxisHours } from '../../utils/stateless/time/time-axis/time-axis'
import { Week } from '../../types/week'
import TimeGridDay from './time-grid-day'
import DateAxis from './date-axis'

type props = {
  staff: StaffBase
  calendarEvents: CalendarEventInternal[]
  backgroundEvents: BackgroundEvent[]
  date: string
}

export default function TimeGridWeekWithStaff({
  staff,
  calendarEvents,
  date,
  backgroundEvents,
}: props) {
  /**
   * The time grid day needs to keep track of whether the mousedown event happened on a calendar event, in order to prevent
   * click events from firing when dragging an event.
   * */
  const [mouseDownOnChild, setMouseDownOnChild] = useState<boolean>(false)
  const $app = useContext(AppContext)

  const [hours, setHours] = useState<number[]>([])
  const fiveMinuteGrid = Array.from({ length: 60 / 5 }, (_, i) => i)

  const timeStringFromDayBoundary = timeStringFromTimePoints(
    $app.config.dayBoundaries.value.start
  )
  const timeStringFromDayBoundaryEnd = timeStringFromTimePoints(
    $app.config.dayBoundaries.value.end
  )
  const dayStartDateTime = setTimeInDateTimeString(
    date,
    timeStringFromDayBoundary
  )
  const dayEndDateTime = $app.config.isHybridDay
    ? addDays(setTimeInDateTimeString(date, timeStringFromDayBoundaryEnd), 1)
    : setTimeInDateTimeString(date, timeStringFromDayBoundaryEnd)

  const dayBoundariesDateTime: DayBoundariesDateTime = {
    start: dayStartDateTime,
    end: dayEndDateTime,
  }

  const eventsWithConcurrency = useMemo(() => {
    const sortedEvents = calendarEvents.sort(sortEventsByStartAndEnd)
    return handleEventConcurrency(sortedEvents)
  }, [calendarEvents])

  const handleOnClick = (
    e: MouseEvent,
    staff: StaffBase,
    callback:
      | ((dateTime: string, e?: UIEvent, staff?: StaffBase) => void)
      | undefined
  ) => {
    if (!callback || mouseDownOnChild) return

    const clickDateTime = getClickDateTime(e, $app, dayStartDateTime)

    if (clickDateTime) {
      callback(clickDateTime, e, staff)
    }
  }
  const handleOnClickFiveMinutes = (
    e: MouseEvent,
    staff: StaffBase,
    callback:
      | ((dateTime: string, e?: UIEvent, staff?: StaffBase) => void)
      | undefined
  ) => {
    if (!callback || mouseDownOnChild) return

    const clickDateTime = getClickDateTime(e, $app, dayStartDateTime)
    if (clickDateTime) {
      const fiveMinuteRangeData = roundMinutesToNearest5(clickDateTime)
      callback(fiveMinuteRangeData, e, staff)
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    const callback = $app.config.callbacks.onMouseDownDateTime
    if (!callback || mouseDownOnChild) return

    const clickDateTime = getClickDateTime(e, $app, dayStartDateTime)
    if (clickDateTime) {
      callback(clickDateTime, e)
    }
  }

  const handlePointerUp = () => {
    const msWaitToEnsureThatClickEventWasDispatched = 10
    setTimeout(() => {
      setMouseDownOnChild(false)
    }, msWaitToEnsureThatClickEventWasDispatched)
  }

  const baseClasses = [
    'sx__time-grid-day',
    getClassNameForWeekday(toJSDate(date).getDay()),
  ]

  const classNames = useComputed(() => {
    const newClassNames = [...baseClasses]
    if ($app.datePickerState.selectedDate.value === date)
      newClassNames.push('is-selected')
    return newClassNames
  })

  useSignalEffect(() => {
    const newHours = getTimeAxisHours(
      $app.config.dayBoundaries.value,
      $app.config.isHybridDay
    )
    setHours(newHours)
  })

  return (
    <>
      <div
        className={classNames.value.join(' ')}
        data-time-grid-date={date}
        data-staff={staff.firstName}
        onClick={(e) =>
          handleOnClick(e, staff, $app.config.callbacks.onClickDateTime)
        }
        onDblClick={(e) =>
          handleOnClick(e, staff, $app.config.callbacks.onDoubleClickDateTime)
        }
        aria-label={getLocalizedDate(date, $app.config.locale.value)}
        onMouseLeave={() => setMouseDownOnChild(false)}
        onMouseUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
        onMouseDown={handleMouseDown}
      >
        <div className="sx__week-grid__time-axis_staff">
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="sx__week-grid__hour_staff">
              {fiveMinuteGrid.map((_, i) => {
                return (
                  <div
                    key={i}
                    className={'sx__week-grid__minute-indicator_for_staff'}
                    onClick={(e) => {
                      handleOnClickFiveMinutes(
                        e,
                        staff,
                        $app.config.callbacks.onClickFiveMinuteRange
                      )
                    }}
                  ></div>
                )
              })}
            </div>
          ))}
        </div>
        {backgroundEvents.map((event) => (
          <>
            <TimeGridBackgroundEvent backgroundEvent={event} date={date} />
          </>
        ))}

        {eventsWithConcurrency.map((event) => {
          if (event.withStaff && event.withStaff.id === staff.id) {
            return (
              <TimeGridEvent
                key={event.id}
                calendarEvent={event}
                dayBoundariesDateTime={dayBoundariesDateTime}
                setMouseDown={setMouseDownOnChild}
              />
            )
          }
        })}
      </div>
    </>
  )
}
