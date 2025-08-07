import { createDatePicker } from '@unimed-x/date-picker'
import '@unimed-x/theme-default/dist/date-picker.css'

const el = document.getElementById('app')
const datePicker = createDatePicker({
  selectedDate: '2022-08-09',
})
datePicker.render(el as HTMLElement)
