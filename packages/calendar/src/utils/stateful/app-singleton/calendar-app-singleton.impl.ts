import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'
import CalendarConfigInternal from '@unimed-x/shared/src/interfaces/calendar/calendar-config'
import TimeUnits from '@unimed-x/shared/src/utils/stateful/time-units/time-units.interface'
import DatePickerState from '@unimed-x/shared/src/interfaces/date-picker/date-picker-state.interface'
import { TranslateFn } from '@unimed-x/shared/src/types/translations'
import CalendarState from '@unimed-x/shared/src/interfaces/calendar/calendar-state.interface'
import DatePickerConfigInternal from '@unimed-x/shared/src/interfaces/date-picker/config.interface'
import CalendarEvents from '@unimed-x/shared/src/interfaces/calendar/calendar-events.interface'
import CalendarElements from '@unimed-x/shared/src/interfaces/calendar/calendar-elements.interface'
import CalendarStaff from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export default class CalendarAppSingletonImpl implements CalendarAppSingleton {
  constructor(
    public config: CalendarConfigInternal,
    public timeUnitsImpl: TimeUnits,
    public calendarState: CalendarState,
    public datePickerState: DatePickerState,
    public translate: TranslateFn,
    public datePickerConfig: DatePickerConfigInternal,
    public calendarEvents: CalendarEvents,
    public elements: CalendarElements = { calendarWrapper: undefined },
    public staffList: CalendarStaff
  ) {}
}
