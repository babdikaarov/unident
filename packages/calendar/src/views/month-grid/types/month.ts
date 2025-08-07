import { CalendarEventInternal } from '@unimed-x/shared/src/interfaces/calendar/calendar-event.interface'
import { BackgroundEvent } from '@unimed-x/shared/src/interfaces/calendar/background-event'

export type MonthDay = {
  date: string
  events: Record<string, CalendarEventInternal | 'blocker' | undefined>
  backgroundEvents: BackgroundEvent[]
}

export type MonthWeek = MonthDay[]

export type Month = MonthWeek[]
