import { computed, signal } from '@preact/signals'

export type StaffBase = {
  id: string
  firstName: string
}

export default abstract class CalendarStaff<T extends StaffBase = StaffBase> {
  abstract currentStartIndex: ReturnType<typeof signal<number>>
  abstract staffPerView: ReturnType<typeof signal<number>>
  abstract hasList: ReturnType<typeof computed<boolean>>

  abstract next(): void
  abstract prev(): void

  abstract setStaffPerView(count: number): void

  // Methods below are generic, to accept any subtype of StaffBase
  abstract setStaffList(staffList: T[]): void
  abstract addStaff(staff: T): void
  abstract removeStaffById(id: string): void

  abstract filterStaff(predicate: (staff: T) => boolean): void
  abstract searchStaff(query: string, keys: (keyof T)[]): void

  // New getter methods instead of direct signal access
  abstract getStaffList(): T[]
  abstract getStaffListOnView(): T[]
  abstract getStaffById(id: string): T | undefined
  abstract canNavigateNext(): boolean
  abstract canNavigatePrev(): boolean
}
