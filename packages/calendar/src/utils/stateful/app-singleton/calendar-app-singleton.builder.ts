import Builder from '@unimed-x/shared/src/interfaces/builder.interface'
import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'
import CalendarAppSingletonImpl from './calendar-app-singleton.impl'
import DatePickerState from '@unimed-x/shared/src/interfaces/date-picker/date-picker-state.interface'
import TimeUnits from '@unimed-x/shared/src/utils/stateful/time-units/time-units.interface'
import { TranslateFn } from '@unimed-x/shared/src/types/translations'
import CalendarConfigInternal from '@unimed-x/shared/src/interfaces/calendar/calendar-config'
import CalendarState from '@unimed-x/shared/src/interfaces/calendar/calendar-state.interface'
import DatePickerConfigInternal from '@unimed-x/shared/src/interfaces/date-picker/config.interface'
import CalendarEvents from '@unimed-x/shared/src/interfaces/calendar/calendar-events.interface'
import { createCalendarStaff } from '../calendar-staffList/calendar-staffList.impl'
import CalendarStaff, {
  StaffBase,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export default class CalendarAppSingletonBuilder
  implements Builder<CalendarAppSingleton>
{
  private config: CalendarConfigInternal | undefined
  private timeUnitsImpl: TimeUnits | undefined
  private datePickerState: DatePickerState | undefined
  private calendarState: CalendarState | undefined
  private translate: TranslateFn | undefined
  private datePickerConfig: DatePickerConfigInternal | undefined
  private calendarEvents: CalendarEvents | undefined
  private staffList: CalendarStaff | undefined

  build(): CalendarAppSingleton {
    return new CalendarAppSingletonImpl(
      this.config!,
      this.timeUnitsImpl!,
      this.calendarState!,
      this.datePickerState!,
      this.translate!,
      this.datePickerConfig!,
      this.calendarEvents!,
      { calendarWrapper: undefined }, // ← this fills `elements`
      this.staffList!
    )
  }

  withConfig(config: CalendarConfigInternal): CalendarAppSingletonBuilder {
    this.config = config
    return this
  }

  withTimeUnitsImpl(timeUnitsImpl: TimeUnits): CalendarAppSingletonBuilder {
    this.timeUnitsImpl = timeUnitsImpl
    return this
  }

  withDatePickerState(
    datePickerState: DatePickerState
  ): CalendarAppSingletonBuilder {
    this.datePickerState = datePickerState
    return this
  }

  withCalendarState(calendarState: CalendarState): CalendarAppSingletonBuilder {
    this.calendarState = calendarState
    return this
  }

  withTranslate(translate: TranslateFn): CalendarAppSingletonBuilder {
    this.translate = translate
    return this
  }

  withDatePickerConfig(
    datePickerConfig: DatePickerConfigInternal
  ): CalendarAppSingletonBuilder {
    this.datePickerConfig = datePickerConfig
    return this
  }

  withCalendarEvents(
    calendarEvents: CalendarEvents
  ): CalendarAppSingletonBuilder {
    this.calendarEvents = calendarEvents
    return this
  }
  withStaffList(
    staff: StaffBase[],
    staffPerView: number | undefined
  ): CalendarAppSingletonBuilder {
    this.staffList = createCalendarStaff(staff, staffPerView)
    return this
  }
}
