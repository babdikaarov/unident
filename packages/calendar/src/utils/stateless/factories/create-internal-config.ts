import { CalendarConfigExternal } from '@unimed-x/shared/src/interfaces/calendar/calendar-config'
import CalendarConfigBuilder from '../../stateful/config/calendar-config.builder'
import { PluginBase } from '@unimed-x/shared/src'
import { translations } from '@unimed-x/translations/src'

export const createInternalConfig = (
  config: CalendarConfigExternal,
  plugins: PluginBase<string>[]
) => {
  return new CalendarConfigBuilder()
    .withLocale(config.locale)
    .withFirstDayOfWeek(config.firstDayOfWeek)
    .withDefaultView(config.defaultView)
    .withViews(config.views)
    .withDayBoundaries(config.dayBoundaries)
    .withWeekOptions(config.weekOptions)
    .withCalendars(config.calendars)
    .withPlugins(plugins)
    .withIsDark(config.isDark)
    .withHasStaffList(config.hasStaffList)
    .withShowDayNumber(config.showDayNumber)
    .withIsLoading(config.isLoading)
    .withShowCurrentTimeIndicator(config.showCurrentTimeIndicator)
    .withIsResponsive(config.isResponsive)
    .withCallbacks(config.callbacks)
    .withMinDate(config.minDate)
    .withMaxDate(config.maxDate)
    .withMonthGridOptions(config.monthGridOptions)
    .withBackgroundEvents(config.backgroundEvents)
    .withTheme(config.theme)
    .withTranslations(config.translations || translations)
    .withWeekNumbers(config.showWeekNumbers)
    .withMinuteBaundaries(config.minuteBoudaries)
    .build()
}
