import { computed, signal } from '@preact/signals'

export type StaffMember = {
  id: string
  name: string
}

export default interface CalendarStaff {
  list: ReturnType<typeof signal<StaffMember[]>>
  listOnView: ReturnType<typeof computed<StaffMember[]>>
  next: () => void
  prev: () => void
  currentStartIndex: ReturnType<typeof signal<number>>
  staffPerView: number
}
