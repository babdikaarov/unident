import { signal, computed } from '@preact/signals'
import CalendarConfigInternal from '@unimed-x/shared/src/interfaces/calendar/calendar-config'
import CalendarStaff, {
  StaffBase,
} from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export const createCalendarStaff = <T extends StaffBase = StaffBase>(
  staff: T[],
  config: CalendarConfigInternal
): CalendarStaff<T> => {
  const originalList = signal<T[]>(staff)
  const list = signal<T[]>(staff)

  // Separate index signals for regular and week views
  const currentStartIndex = signal<number>(0)
  const currentStartIndexWeek = signal<number>(0)

  const initialViewCount = config.staffPerView.value
  const initialViewCountWeek = config.staffPerViewWeek.value
  const maxPerView = 7
  const maxPerViewWeek = 2

  // Helper function to calculate proper perView based on current list
  const calculatePerView = (
    currentList: T[],
    maxAllowed: number,
    requestedCount?: number
  ): number => {
    if (currentList.length === 0) return 1 // minimum 1 as specified

    const defaultCount = requestedCount ?? maxAllowed

    // If list length is less than maxAllowed, use list length
    if (currentList.length < maxAllowed) {
      return Math.min(currentList.length, defaultCount)
    }

    // If list length is maxAllowed or more, limit to maxAllowed
    return Math.min(maxAllowed, defaultCount)
  }

  // Initialize staffPerView with proper logic
  const staffPerView = signal<number>(
    calculatePerView(staff, maxPerView, config.staffPerView.value)
  )

  // Initialize staffPerViewWeek with proper logic
  const staffPerViewWeek = signal<number>(
    calculatePerView(staff, maxPerViewWeek, config.staffPerViewWeek.value)
  )

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

  const listOnViewWeek = computed(() => {
    const start = currentStartIndexWeek.value // Uses separate index
    const all = list.value
    const perView = staffPerViewWeek.value
    const result: T[] = []

    if (all.length === 0) return result

    for (let i = 0; i < perView; i++) {
      result.push(all[(start + i) % all.length])
    }
    return result
  })

  // Helper function to adjust regular view currentStartIndex when list changes
  const adjustCurrentIndex = (newList: T[]) => {
    if (newList.length === 0) {
      currentStartIndex.value = 0
    } else if (currentStartIndex.value >= newList.length) {
      // If current index is out of bounds, reset to 0
      currentStartIndex.value = 0
    }
    // If index is still valid, keep it as is
  }

  // Helper function to adjust week view currentStartIndex when list changes
  const adjustCurrentIndexWeek = (newList: T[]) => {
    if (newList.length === 0) {
      currentStartIndexWeek.value = 0
    } else if (currentStartIndexWeek.value >= newList.length) {
      // If current index is out of bounds, reset to 0
      currentStartIndexWeek.value = 0
    }
    // If index is still valid, keep it as is
  }

  // Helper function to update perView and indexes together
  const syncPerViewAndIndex = (newList: T[]) => {
    staffPerView.value = calculatePerView(newList, maxPerView, initialViewCount)
    staffPerViewWeek.value = calculatePerView(
      newList,
      maxPerViewWeek,
      initialViewCountWeek
    )

    // Adjust both indexes independently
    adjustCurrentIndex(newList)
    adjustCurrentIndexWeek(newList)
  }

  const next = () => {
    if (
      list.value.length > 0 &&
      currentStartIndex.value < list.value.length - 1
    ) {
      currentStartIndex.value = currentStartIndex.value + 1
    }
  }

  const prev = () => {
    if (list.value.length > 0 && currentStartIndex.value > 0) {
      currentStartIndex.value = currentStartIndex.value - 1
    }
  }

  // New navigation methods for week view
  const nextWeek = () => {
    if (
      list.value.length > 0 &&
      currentStartIndexWeek.value < list.value.length - 1
    ) {
      currentStartIndexWeek.value = currentStartIndexWeek.value + 1
    }
  }

  const prevWeek = () => {
    if (list.value.length > 0 && currentStartIndexWeek.value > 0) {
      currentStartIndexWeek.value = currentStartIndexWeek.value - 1
    }
  }

  const setStaffPerView = (count: number) => {
    if (count < 1) count = 1 // ensure minimum 1
    staffPerView.value = calculatePerView(list.value, maxPerView, count)
    adjustCurrentIndex(list.value) // Only affects regular view
  }

  const setStaffPerViewWeek = (count: number) => {
    if (count < 1) count = 1 // ensure minimum 1
    staffPerViewWeek.value = calculatePerView(list.value, maxPerViewWeek, count)
    adjustCurrentIndexWeek(list.value) // Only affects week view
  }

  const setStaffList = (staffList: T[]) => {
    originalList.value = [...staffList]
    list.value = [...staffList]
    syncPerViewAndIndex(staffList)
  }

  const addStaff = (staff: T) => {
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

  const getStaffListOnViewWeek = (): T[] => {
    return [...listOnViewWeek.value] // return defensive copy
  }

  const getStaffListFull = (): T[] => {
    return originalList.value
  }

  const getStaffById = (id: string): T | undefined => {
    return list.value.find((staff) => staff.id === id)
  }

  const canNavigateNext = (): boolean => {
    return currentStartIndex.value + staffPerView.value < list.value.length
  }

  const canNavigatePrev = (): boolean => {
    return currentStartIndex.value > 0
  }

  // New navigation check methods for week view
  const canNavigateNextWeek = (): boolean => {
    return (
      currentStartIndexWeek.value + staffPerViewWeek.value < list.value.length
    )
  }

  const canNavigatePrevWeek = (): boolean => {
    return currentStartIndexWeek.value > 0
  }

  return {
    hasList,
    currentStartIndex,
    currentStartIndexWeek, 
    staffPerView,
    staffPerViewWeek,
    next,
    prev,
    nextWeek,
    prevWeek,
    setStaffPerView,
    setStaffPerViewWeek,
    setStaffList,
    addStaff,
    canNavigateNext,
    canNavigatePrev,
    canNavigateNextWeek, 
    canNavigatePrevWeek,
    removeStaffById,
    searchStaff,
    filterStaff,
    getStaffList,
    getStaffListOnView,
    getStaffListOnViewWeek,
    getStaffById,
    getStaffListFull,
  }
}
