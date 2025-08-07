import { datePickerEsES } from './date-picker'
import { Language } from '@unimed-x/shared/src/types/translations/language.translations'
import { calendarEsES } from './calendar'
import { timePickerEsES } from './time-picker'

export const esES: Language = {
  ...datePickerEsES,
  ...calendarEsES,
  ...timePickerEsES,
}
