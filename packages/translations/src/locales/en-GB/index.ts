import { datePickerEnGB } from './date-picker'
import { Language } from '@unimed-x/shared/src/types/translations/language.translations'
import { calendarEnGB } from './calendar'
import { timePickerEnGB } from './time-picker'

export const enGB: Language = {
  ...datePickerEnGB,
  ...calendarEnGB,
  ...timePickerEnGB,
}
