import { signal, computed } from '@preact/signals'
import CalendarStaff, {
  StaffBase,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export const createCalendarStaff = (
  staff: StaffBase[],
  viewCount: number
): CalendarStaff => {
  const list = signal<StaffBase[]>(staff)
  const hasList = computed(() => list.value.length > 1)
  const currentStartIndex = signal<number>(0)
  const staffPerView = signal<number>(viewCount)
  const listOnView = computed(() => {
    const start = currentStartIndex.value
    const all = list.value
    const result: StaffBase[] = []

    for (let i = 0; i < staffPerView.value; i++) {
      result.push(all[(start + i) % all.length])
    }
    return result
  })

  const next = () => {
    currentStartIndex.value = (currentStartIndex.value + 1) % list.value.length
  }

  const prev = () => {
    currentStartIndex.value =
      (currentStartIndex.value - 1 + list.value.length) % list.value.length
  }
  const setStaffPerView = (count: number) => {
    staffPerView.value = count > 5 ? 5 : count
  }
  const setStaffList = (staff: StaffBase[]) => {
    list.value = staff
  }
  const addStaffList = (staff: StaffBase) => {
    list.value = [...list.value, staff]
  }

  return {
    hasList,
    list,
    listOnView,
    currentStartIndex,
    staffPerView,
    next,
    prev,
    setStaffPerView,
    setStaffList,
    addStaffList,
  }
}
