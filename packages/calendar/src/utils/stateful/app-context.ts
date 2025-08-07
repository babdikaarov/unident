import { createContext } from 'preact'
import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'

export const AppContext = createContext<CalendarAppSingleton>(
  {} as CalendarAppSingleton
)
