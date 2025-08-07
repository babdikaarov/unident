import { datePickerUkUA } from './date-picker'
import { Language } from '@unimed-x/shared/src/types/translations/language.translations'
import { calendarUkUA } from './calendar'
import { timePickerUkUA } from './time-picker'

export const ukUA: Language = {
  ...datePickerUkUA,
  ...calendarUkUA,
  ...timePickerUkUA,
}
