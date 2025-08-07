import { computed, signal } from '@preact/signals'

export type StaffBase = {
  id: string
  firstName: string
}

export default interface CalendarStaff {
  list: ReturnType<typeof signal<StaffBase[]>>
  listOnView: ReturnType<typeof computed<StaffBase[]>>
  currentStartIndex: ReturnType<typeof signal<number>>
  staffPerView: ReturnType<typeof signal<number>>
  hasList: ReturnType<typeof computed<boolean>>
  next: () => void
  prev: () => void
  setStaffPerView: (count: number) => void
  setStaffList: (staffList: StaffBase[]) => void
  addStaffList: (staff: StaffBase) => void
}
