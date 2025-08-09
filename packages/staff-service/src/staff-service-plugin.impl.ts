import { CalendarAppSingleton } from '@unimed-x/shared/src'
import { definePlugin } from '@unimed-x/shared/src/utils/stateless/calendar/define-plugin'
import { StaffService } from '@unimed-x/shared/src/interfaces/staff-service/staff-service.interface'
import { StaffBase } from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

class StaffServicePluginImpl implements StaffService {
  name = 'StaffServicePlugin'
  $app!: CalendarAppSingleton

  beforeRender($app: CalendarAppSingleton) {
    this.$app = $app
  }

  next() {
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.next()
  }

  prev() {
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.prev()
  }

  setStaffPerView(count: number) {
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.setStaffPerView(count)
  }

  setStaffList<T extends StaffBase>(staffList: T[]) {
    // Cast to StaffBase[] since the underlying implementation expects StaffBase
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.setStaffList((staffList as StaffBase[]) || [])
  }

  addStaff<T extends StaffBase>(staff: T) {
    // Cast to StaffBase since the underlying implementation expects StaffBase
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.addStaff(staff as StaffBase)
  }

  removeStaffById(id: string) {
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.removeStaffById(id)
  }

  searchStaff<T extends StaffBase>(query: string, keys: (keyof T)[]) {
    // Cast keys to work with the underlying StaffBase implementation
    if (!this.$app) this.throwNotInitializedError()
    this.$app.staffList.searchStaff(query, keys as (keyof StaffBase)[])
  }

  filterStaff<T extends StaffBase>(predicate: (staff: T) => boolean) {
    // Create a wrapper predicate that works with StaffBase
    if (!this.$app) this.throwNotInitializedError()
    const basePredicate = (staff: StaffBase): boolean => {
      return predicate(staff as T)
    }
    this.$app.staffList.filterStaff(basePredicate)
  }

  getStaffList<T extends StaffBase>(): T[] {
    if (!this.$app) this.throwNotInitializedError()
    return this.$app.staffList.getStaffList() as T[]
  }

  getStaffListOnView<T extends StaffBase>(): T[] {
    if (!this.$app) this.throwNotInitializedError()
    return this.$app.staffList.getStaffListOnView() as T[]
  }

  getStaffById<T extends StaffBase>(id: string): T | undefined {
    if (!this.$app) this.throwNotInitializedError()
    return this.$app.staffList.getStaffById(id) as T | undefined
  }

  // Additional utility methods that might be useful
  getCurrentStartIndex(): number {
    if (!this.$app) this.throwNotInitializedError()
    return this.$app.staffList.currentStartIndex.value || 0
  }

  getStaffPerView(): number {
    if (!this.$app) this.throwNotInitializedError()
    return this.$app.staffList.staffPerView.value || 7
  }

  hasList(): boolean {
    if (!this.$app) this.throwNotInitializedError()
    return this.$app.staffList.hasList.value
  }

  // Convenience method to get total staff count
  getStaffCount(): number {
    if (!this.$app) this.throwNotInitializedError()
    return this.getStaffList().length
  }

  // Convenience method to check if there are more items to navigate
  canNavigateNext(): boolean {
    if (!this.$app) this.throwNotInitializedError()
    const list = this.getStaffList()
    const perView = this.getStaffPerView()
    return list.length > perView
  }

  canNavigatePrev(): boolean {
    if (!this.$app) this.throwNotInitializedError()
    return this.canNavigateNext() // Since it's circular, same logic applies
  }
  private throwNotInitializedError() {
    throw new Error(
      'Plugin not yet initialized. The events service plugin is not intended to add the initial events. For adding events upon rendering, add them directly to the configuration object passed to `createCalendar`, or `useCalendarApp` if you are using the React component'
    )
  }
}

export const createStaffServicePlugin = () => {
  return definePlugin('StaffService', new StaffServicePluginImpl())
}
