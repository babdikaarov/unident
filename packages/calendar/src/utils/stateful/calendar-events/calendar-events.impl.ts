import CalendarEventExternal, {
  CalendarEventInternal,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-event.interface'
import CalendarEvents, {
  EventsFilterPredicate,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-events.interface'
import { signal } from '@preact/signals'
import CalendarConfigInternal from '@unimed-x/shared/src/interfaces/calendar/calendar-config'
import { externalEventToInternal } from '@unimed-x/shared/src/utils/stateless/calendar/external-event-to-internal'
import { BackgroundEvent } from '@unimed-x/shared/src/interfaces/calendar/background-event'

export const createCalendarEventsImpl = (
  events: CalendarEventExternal[],
  backgroundEvents: BackgroundEvent[],
  config: CalendarConfigInternal
): CalendarEvents => {
  const list = signal<CalendarEventInternal[]>(
    events.map((event) => {
      return externalEventToInternal(event, config)
    })
  )

  const filterPredicate = signal<EventsFilterPredicate | undefined>(undefined)

  return {
    list,
    filterPredicate,
    backgroundEvents: signal(backgroundEvents),
  }
}
