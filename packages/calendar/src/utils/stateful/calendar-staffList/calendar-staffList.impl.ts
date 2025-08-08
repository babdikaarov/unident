import { signal, computed } from '@preact/signals'
import CalendarStaff, {
  StaffBase,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export const createCalendarStaff = <T extends StaffBase = StaffBase>(
  staff: T[],
  viewCount?: number
): CalendarStaff<T> => {
  const originalList = signal<T[]>(staff)
  const list = signal<T[]>(staff)
  const currentStartIndex = signal<number>(0)

  // Helper function to calculate proper perView based on current list
  const calculatePerView = (
    currentList: T[],
    requestedCount?: number
  ): number => {
    if (currentList.length === 0) return 1 // minimum 1 as specified

    const defaultCount = requestedCount ?? 7
    const maxAllowed = 7

    // If list length is less than 7, use list length
    if (currentList.length < 7) {
      return Math.max(1, Math.min(currentList.length, defaultCount))
    }

    // If list length is 7 or more, limit to 7
    return Math.min(maxAllowed, defaultCount)
  }

  // Initialize staffPerView with proper logic
  const staffPerView = signal<number>(calculatePerView(staff, viewCount))

  const hasList = computed(() => list.value.length > 0)

  const listOnView = computed(() => {
    const start = currentStartIndex.value
    const all = list.value
    const perView = staffPerView.value
    const result: T[] = []

    if (all.length === 0) return result

    for (let i = 0; i < perView; i++) {
      result.push(all[(start + i) % all.length])
    }
    return result
  })

  // Helper function to adjust currentStartIndex when list changes
  const adjustCurrentIndex = (newList: T[]) => {
    if (newList.length === 0) {
      currentStartIndex.value = 0
    } else if (currentStartIndex.value >= newList.length) {
      // If current index is out of bounds, reset to 0
      currentStartIndex.value = 0
    }
    // If index is still valid, keep it as is
  }

  // Helper function to update perView and index together
  const syncPerViewAndIndex = (newList: T[]) => {
    staffPerView.value = calculatePerView(newList, staffPerView.value)
    adjustCurrentIndex(newList)
  }

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
    if (count < 1) count = 1 // ensure minimum 1
    staffPerView.value = calculatePerView(list.value, count)
    adjustCurrentIndex(list.value)
  }

  const setStaffList = (staffList: T[]) => {
    originalList.value = [...staffList]
    list.value = [...staffList]
    syncPerViewAndIndex(staffList)
  }

  const addStaffList = (staff: T) => {
    const newOriginalList = [...originalList.value, staff]
    const newList = [...list.value, staff]

    originalList.value = newOriginalList
    list.value = newList
    syncPerViewAndIndex(newList)
  }

  const removeStaffById = (id: string) => {
    const newOriginalList = originalList.value.filter((s) => s.id !== id)
    const newList = list.value.filter((s) => s.id !== id)

    originalList.value = newOriginalList
    list.value = newList
    syncPerViewAndIndex(newList)
  }

  const filterStaff = (predicate: (staff: T) => boolean) => {
    const filteredList = originalList.value.filter(predicate)
    list.value = filteredList
    syncPerViewAndIndex(filteredList)
  }

  const searchStaff = (term: string, keys: (keyof T)[]) => {
    const lower = term.trim().toLowerCase()
    let searchedList: T[]

    if (!lower) {
      searchedList = [...originalList.value]
    } else {
      searchedList = originalList.value.filter((staff) =>
        keys.some((key) =>
          String(staff[key] ?? '')
            .toLowerCase()
            .includes(lower)
        )
      )
    }

    list.value = searchedList
    syncPerViewAndIndex(searchedList)
  }

  const getStaffList = (): T[] => {
    return [...list.value] // return defensive copy
  }

  const getStaffListOnView = (): T[] => {
    return [...listOnView.value] // return defensive copy
  }

  const getStaffById = (id: string): T | undefined => {
    return list.value.find((staff) => staff.id === id)
  }

  return {
    hasList,
    currentStartIndex,
    staffPerView,
    next,
    prev,
    setStaffPerView,
    setStaffList,
    addStaffList,
    removeStaffById,
    searchStaff,
    filterStaff,
    getStaffList,
    getStaffListOnView,
    getStaffById,
  }
}
