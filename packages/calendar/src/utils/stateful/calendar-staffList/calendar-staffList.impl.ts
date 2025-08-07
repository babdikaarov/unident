import { signal, computed } from '@preact/signals'
import CalendarStaff, {
  StaffMember,
} from '@schedule-x/shared/src/interfaces/calendar/calendar-staff.interface'

export const createCalendarStaff = (
  staff: StaffMember[],
  staffPerView: number = 5
): CalendarStaff => {
  const list = signal<StaffMember[]>(staff)
  const currentStartIndex = signal<number>(0)

  const listOnView = computed(() => {
    const start = currentStartIndex.value
    const all = list.value
    const result: StaffMember[] = []

    for (let i = 0; i < staffPerView; i++) {
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

  return {
    list,
    listOnView,
    next,
    prev,
    currentStartIndex,
    staffPerView,
  }
}
