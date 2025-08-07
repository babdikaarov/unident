import { datePickerEnUS } from './date-picker'
import { Language } from '@unimed-x/shared/src/types/translations/language.translations'
import { calendarEnUS } from './calendar'
import { timePickerEnUS } from './time-picker'

export const enUS: Language = {
  ...datePickerEnUS,
  ...calendarEnUS,
  ...timePickerEnUS,
}
