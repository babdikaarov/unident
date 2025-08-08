import { EventId } from '../../../types/event-id'
import CalendarEventExternal from '../../../interfaces/calendar/calendar-event.interface'

export default interface EventsFacade {
  add(event: CalendarEventExternal): void
  update(event: CalendarEventExternal): void
  remove(id: EventId): void
  get(id: EventId): CalendarEventExternal | undefined
  getAll(): CalendarEventExternal[]
  set(events: CalendarEventExternal[]): void
}
