import PluginBase from '../plugin.interface'
import { StaffBase } from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export interface StaffService extends PluginBase<string> {
  // Navigation methods
  next(): void
  prev(): void

  // Configuration methods
  setStaffPerView(count: number): void

  // Staff management methods (generic)
  setStaffList<T extends StaffBase>(staffList: T[]): void
  addStaffList<T extends StaffBase>(staff: T): void
  removeStaffById(id: string): void

  // Search and filter methods (generic)
  searchStaff<T extends StaffBase>(query: string, keys: (keyof T)[]): void
  filterStaff<T extends StaffBase>(predicate: (staff: T) => boolean): void

  // Data access methods (generic)
  getStaffList<T extends StaffBase>(): T[]
  getStaffListOnView<T extends StaffBase>(): T[]
  getStaffById<T extends StaffBase>(id: string): T | undefined

  // Utility methods for state access
  getCurrentStartIndex(): number
  getStaffPerView(): number
  hasList(): boolean
  getStaffCount(): number

  // Navigation state methods
  canNavigateNext(): boolean
  canNavigatePrev(): boolean
}
