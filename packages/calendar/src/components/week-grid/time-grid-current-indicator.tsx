import { useState, useEffect } from 'preact/hooks'
import { getYCoordinateInTimeGrid } from '@unimed-x/shared/src/utils/stateless/calendar/get-y-coordinate-in-time-grid'
import {
  CalendarAppSingleton,
  toDateString,
  toDateTimeString,
} from '@unimed-x/shared/src'

interface Props {
  $app: CalendarAppSingleton
  date: string
  isWeek?: boolean
}

export default function TimeGridCurrentTimeIndicator({
  $app,
  date,
  isWeek = false,
}: Props) {
  const todayDateString = toDateString(new Date())

  if (!$app.config.showCurrentTimeIndicator.value) return null
  if (date !== todayDateString) {
    return null
  }
  const [top, setTop] = useState(() => {
    return (
      getYCoordinateInTimeGrid(
        toDateTimeString(new Date()),
        $app.config.dayBoundaries.value,
        $app.config.timePointsPerDay
      ) + '%'
    )
  })

  useEffect(() => {
    const updateTop = () => {
      setTop(
        getYCoordinateInTimeGrid(
          toDateTimeString(new Date()),
          $app.config.dayBoundaries.value,
          $app.config.timePointsPerDay
        ) + '%'
      )
    }
    // Align the first update to the next minute
    const msToNextMinute = 60000 - (Date.now() % 60000)
    const firstTimeout = setTimeout(() => {
      updateTop()
      const interval = setInterval(updateTop, 60000)
      return () => clearInterval(interval)
    }, msToNextMinute)

    return () => clearTimeout(firstTimeout)
  }, [$app.config.dayBoundaries.value, $app.config.timePointsPerDay])

  return (
    <>
      {isWeek ? (
        <div className="sx__current-time-indicator-full" style={{ top }} />
      ) : (
        <div className="sx__current-time-indicator" style={{ top }} />
      )}
    </>
  )
}
