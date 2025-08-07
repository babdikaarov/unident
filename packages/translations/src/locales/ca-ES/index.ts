import { datePickerCaES } from './date-picker'
import { Language } from '@unimed-x/shared/src/types/translations/language.translations'
import { calendarCaES } from './calendar'
import { timePickerCaES } from './time-picker'

export const caES: Language = {
  ...datePickerCaES,
  ...calendarCaES,
  ...timePickerCaES,
}
