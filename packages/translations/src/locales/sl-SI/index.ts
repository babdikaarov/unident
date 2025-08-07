import { datePickerSlSI } from './date-picker'
import { Language } from '@unimed-x/shared/src/types/translations/language.translations'
import { calendarSlSI } from './calendar'
import { timePickerSlSI } from './time-picker'

export const slSI: Language = {
  ...datePickerSlSI,
  ...calendarSlSI,
  ...timePickerSlSI,
}
