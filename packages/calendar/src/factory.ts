import CalendarApp from './calendar.app'
import { CalendarConfigExternal } from '@unimed-x/shared/src/interfaces/calendar/calendar-config'
import CalendarAppSingletonBuilder from './utils/stateful/app-singleton/calendar-app-singleton.builder'
import { createDatePickerState } from '@unimed-x/date-picker/src/utils/stateful/date-picker-state/date-picker-state.impl'
import { translate } from '@unimed-x/translations/src'
import { createCalendarState } from './utils/stateful/calendar-state/calendar-state.impl'
import { createCalendarEventsImpl } from './utils/stateful/calendar-events/calendar-events.impl'
import { createInternalConfig } from './utils/stateless/factories/create-internal-config'
import { createTimeUnitsImpl } from './utils/stateless/factories/create-time-units-impl'
import { createDatePickerConfig } from './utils/stateless/factories/create-date-picker-config'
import { createDateSelectionCallback } from './utils/stateless/factories/create-date-selection-callback'
import { PluginBase } from '@unimed-x/shared/src'
import { validatePlugins } from './utils/stateless/validation/validate-plugins'
import { validateConfig } from './utils/stateless/validation/validate-config'
import { validateEvents } from '@unimed-x/shared/src/utils/stateless/validation/validate-events'

export const createCalendarAppSingleton = (
  config: CalendarConfigExternal,
  plugins: PluginBase<string>[]
) => {
  const internalConfig = createInternalConfig(config, plugins)
  const timeUnitsImpl = createTimeUnitsImpl(internalConfig)
  const calendarState = createCalendarState(
    internalConfig,
    timeUnitsImpl,
    config.selectedDate
  )
  const dateSelectionCallback = createDateSelectionCallback(
    calendarState,
    config
  )
  const datePickerConfig = createDatePickerConfig(config, dateSelectionCallback)
  const datePickerState = createDatePickerState(
    datePickerConfig,
    config.selectedDate || config.datePicker?.selectedDate
  )
  const calendarEvents = createCalendarEventsImpl(
    config.events || [],
    config.backgroundEvents || [],
    internalConfig
  )
  const staffList = config.staff || []
  return new CalendarAppSingletonBuilder()
    .withConfig(internalConfig)
    .withTimeUnitsImpl(timeUnitsImpl)
    .withDatePickerState(datePickerState)
    .withStaffList(staffList, config.staffPerView || 1)
    .withCalendarEvents(calendarEvents)
    .withDatePickerConfig(datePickerConfig)
    .withCalendarState(calendarState)
    .withTranslate(
      translate(internalConfig.locale, internalConfig.translations)
    )
    .build()
}

type CalendarAppWithPlugins<Plugins extends PluginBase<string>[]> = {
  [Name in Plugins[number]['name']]: Extract<Plugins[number], { name: Name }>
}

export const createCalendar = <Plugins extends PluginBase<string>[]>(
  config: CalendarConfigExternal,
  plugins?: Plugins
) => {
  validatePlugins(config.plugins, plugins)
  if (config.skipValidation !== true) {
    validateEvents(config.events)
    validateConfig(config)
  }

  return new CalendarApp(
    createCalendarAppSingleton(config, plugins || config.plugins || [])
  ) as CalendarApp & CalendarAppWithPlugins<Plugins>
}
