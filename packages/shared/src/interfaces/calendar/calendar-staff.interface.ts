import { computed, signal } from '@preact/signals'

export type StaffBase = {
  id: string
  firstName: string
}

export default interface CalendarStaff<T extends StaffBase = StaffBase> {
  list: ReturnType<typeof signal<T[]>>
  listOnView: ReturnType<typeof computed<T[]>>
  currentStartIndex: ReturnType<typeof signal<number>>
  staffPerView: ReturnType<typeof signal<number>>
  hasList: ReturnType<typeof computed<boolean>>

  next: () => void
  prev: () => void

  setStaffPerView: (count: number) => void

  // Methods below are generic, to accept any subtype of StaffBase

  setStaffList: (staffList: T[]) => void
  addStaffList: (staff: T) => void

  filterStaff: (predicate: (staff: T) => boolean) => void
  searchStaff: (query: string, keys: (keyof T)[]) => void
}
