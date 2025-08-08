import { signal, computed } from '@preact/signals'
import CalendarStaff, {
  StaffBase,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export const createCalendarStaff = <
  T extends StaffBase = StaffBase, // generic so you can extend StaffBase
>(
  staff: T[],
  viewCount?: number
): CalendarStaff<T> => {
  const originalList = signal<T[]>(staff)
  const list = signal<T[]>(staff)

  const hasList = computed(() => list.value.length > 1)
  const currentStartIndex = signal<number>(0)

  const initialPerView = Math.min(list.value.length, viewCount ?? 7, 7)
  const staffPerView = signal<number>(initialPerView)

  const listOnView = computed(() => {
    const start = currentStartIndex.value
    const all = list.value
    const result: T[] = []

    for (let i = 0; i < staffPerView.value; i++) {
      if (all.length === 0) break
      result.push(all[(start + i) % all.length])
    }
    return result
  })

  const next = () => {
    if (list.value.length > 0) {
      currentStartIndex.value =
        (currentStartIndex.value + 1) % list.value.length
    }
  }

  const prev = () => {
    if (list.value.length > 0) {
      currentStartIndex.value =
        (currentStartIndex.value - 1 + list.value.length) % list.value.length
    }
  }

  const setStaffPerView = (count: number) => {
    staffPerView.value = Math.min(list.value.length, count, 7)
  }

  const setStaffList = (staffList: T[]) => {
    originalList.value = staffList
    list.value = staffList
    staffPerView.value = Math.min(list.value.length, staffPerView.value, 7)
  }

  const addStaffList = (staff: T) => {
    originalList.value = [...originalList.value, staff]
    list.value = [...list.value, staff]
    staffPerView.value = Math.min(list.value.length, staffPerView.value, 7)
  }

  const filterStaff = (predicate: (staff: T) => boolean) => {
    list.value = originalList.value.filter(predicate)
    staffPerView.value = Math.min(list.value.length, staffPerView.value, 7)
    currentStartIndex.value = 0
  }

  const searchStaff = (term: string, keys: (keyof T)[]) => {
    const lower = term.trim().toLowerCase()
    if (!lower) {
      list.value = originalList.value
    } else {
      list.value = originalList.value.filter((staff) =>
        keys.some((key) =>
          String(staff[key] ?? '')
            .toLowerCase()
            .includes(lower)
        )
      )
    }
    staffPerView.value = Math.min(list.value.length, staffPerView.value, 7)
    currentStartIndex.value = 0
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
    searchStaff,
    filterStaff,
  }
}
