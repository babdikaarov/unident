import { computed, signal } from '@preact/signals'

export type StaffBase = {
  id: string
  firstName: string
}

export default interface CalendarStaff<T extends StaffBase = StaffBase> {
  currentStartIndex: ReturnType<typeof signal<number>>
  staffPerView: ReturnType<typeof signal<number>>
  hasList: ReturnType<typeof computed<boolean>>

  next: () => void
  prev: () => void

  setStaffPerView: (count: number) => void

  // Methods below are generic, to accept any subtype of StaffBase
  setStaffList: (staffList: T[]) => void
  addStaffList: (staff: T) => void
  removeStaffById: (id: string) => void

  filterStaff: (predicate: (staff: T) => boolean) => void
  searchStaff: (query: string, keys: (keyof T)[]) => void

  // New getter methods instead of direct signal access
  getStaffList: () => T[]
  getStaffListOnView: () => T[]
  getStaffById: (id: string) => T | undefined
  canNavigateNext: () => boolean
  canNavigatePrev: () => boolean
}
