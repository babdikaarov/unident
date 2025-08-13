import { useContext, useEffect, useMemo, useState, useRef } from 'preact/hooks'
import { AppContext } from '../../utils/stateful/app-context'
import {
  getIntervalsPerHour,
  getTimeAxisHours,
} from '../../utils/stateless/time/time-axis/time-axis'
import { useSignalEffect } from '@preact/signals'
import { randomStringId } from '@unimed-x/shared/src'

export default function TimeAxis() {
  const $app = useContext(AppContext)
  const [hours, setHours] = useState<number[]>([])
  const [minutesInterval, setMinutesInterval] = useState<{
    array: number[]
    minute: number
  }>(getIntervalsPerHour($app.config.minuteBoudaries.value))

  // Store the base grid height per hour (this should be consistent)
  const [baseHourHeight, setBaseHourHeight] = useState<number>(() => {
    const hoursPerDay = $app.config.timePointsPerDay / 100
    return $app.config.weekOptions.value.gridHeight / hoursPerDay
  })

  // Store previous minute boundaries for smooth transitions
  const previousMinuteBoundaries = useRef<number>(
    $app.config.minuteBoudaries.value
  )

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false)

  useSignalEffect(() => {
    const newHours = getTimeAxisHours(
      $app.config.dayBoundaries.value,
      $app.config.isHybridDay
    )
    setHours(newHours)
    setMinutesInterval(getIntervalsPerHour($app.config.minuteBoudaries.value))

    const hoursPerDay = $app.config.timePointsPerDay / 100
    const pixelsPerHour = $app.config.weekOptions.value.gridHeight / hoursPerDay

    document.documentElement.style.setProperty(
      '--sx-week-grid-hour-height',
      `${pixelsPerHour}px`
    )
    const count = Math.floor(60 / $app.config.minuteBoudaries.value)

    document.documentElement.style.setProperty(
      '--sx-minute-interval',
      count.toString()
    )
  })

  // Handle minute boundary changes with proper scaling
  useEffect(() => {
    const currentMinuteBoundaries = $app.config.minuteBoudaries.value
    const previousMinuteBounds = previousMinuteBoundaries.current

    // Skip if this is the initial render or no change
    if (previousMinuteBounds === currentMinuteBoundaries) {
      return
    }

    const animateGridHeightChange = (
      fromHeight: number,
      toHeight: number,
      duration: number = 300
    ) => {
      setIsAnimating(true)
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease-out animation for smoothness
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentHeight = fromHeight + (toHeight - fromHeight) * easeOut

        // Update the grid height
        $app.config.weekOptions.value = {
          ...$app.config.weekOptions.value,
          gridHeight: currentHeight,
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }

    // Calculate target height based on minute intervals
    const currentIntervalsPerHour = 60 / currentMinuteBoundaries
    const hoursPerDay = $app.config.timePointsPerDay / 100

    // Define minimum height per minute interval for readability
    const MIN_INTERVAL_HEIGHT = 18 // pixels
    const MAX_INTERVAL_HEIGHT = 120 // pixels

    // Calculate ideal height per interval based on minute boundaries
    let heightPerInterval: number

    // Use a scaling approach that ensures readability
    switch (currentMinuteBoundaries) {
      case 60:
        heightPerInterval = 60 // One interval per hour - can be smaller
        break
      case 30:
        heightPerInterval = 50 // Two intervals per hour
        break
      case 20:
        heightPerInterval = 44 // Three intervals per hour
        break
      case 15:
        heightPerInterval = 30 // Four intervals per hour
        break
      case 10:
        heightPerInterval = 28 // Six intervals per hour
        break
      case 5:
        heightPerInterval = 25 // Twelve intervals per hour
        break
      default:
        // For any other value, calculate dynamically
        heightPerInterval = Math.max(
          MIN_INTERVAL_HEIGHT,
          Math.min(MAX_INTERVAL_HEIGHT, 300 / currentIntervalsPerHour)
        )
    }

    // Ensure minimum and maximum bounds
    heightPerInterval = Math.max(
      MIN_INTERVAL_HEIGHT,
      Math.min(MAX_INTERVAL_HEIGHT, heightPerInterval)
    )

    // Calculate total grid height
    const totalIntervals = hoursPerDay * currentIntervalsPerHour
    const targetHeight = totalIntervals * heightPerInterval

    // Get current height for animation
    const currentGridHeight = $app.config.weekOptions.value.gridHeight

    // Debug logging
    console.log('=== Minute Boundary Change ===')
    console.log(
      `Minute boundaries: ${previousMinuteBounds} -> ${currentMinuteBoundaries}`
    )
    console.log(`Intervals per hour: ${currentIntervalsPerHour}`)
    console.log(`Hours per day: ${hoursPerDay}`)
    console.log(`Total intervals: ${totalIntervals}`)
    console.log(`Height per interval: ${heightPerInterval}px`)
    console.log(`Current height: ${currentGridHeight.toFixed(0)}px`)
    console.log(`Target height: ${targetHeight.toFixed(0)}px`)
    console.log(
      `Change: ${((targetHeight / currentGridHeight - 1) * 100).toFixed(1)}%`
    )
    console.log('=============================')

    // Animate the change
    animateGridHeightChange(currentGridHeight, targetHeight)

    // Update the previous minute boundaries
    previousMinuteBoundaries.current = currentMinuteBoundaries

    // Update base hour height for reference
    setBaseHourHeight(targetHeight / hoursPerDay)
  }, [$app.config.minuteBoudaries.value])

  // Handle external grid height changes (like zoom)
  useEffect(() => {
    const currentGridHeight = $app.config.weekOptions.value.gridHeight

    // Only update base height if we're not currently animating
    if (!isAnimating) {
      const hoursPerDay = $app.config.timePointsPerDay / 100
      const newBaseHourHeight = currentGridHeight / hoursPerDay
      setBaseHourHeight(newBaseHourHeight)

      console.log(
        `External height change: ${currentGridHeight}px (${newBaseHourHeight.toFixed(1)}px per hour)`
      )
    }
  }, [$app.config.weekOptions.value.gridHeight])

  const formatterMinutes = new Intl.DateTimeFormat($app.config.locale.value, {
    ...$app.config.weekOptions.value.timeAxisFormatOptions,
    minute: '2-digit',
  })

  const hourCustomComponentFn = $app.config._customComponentFns.weekGridHour
  const hourCCIDs = useMemo(() => {
    if (!hourCustomComponentFn) return []

    return hours.map(() => `custom-week-grid-hour-${randomStringId()}`)
  }, [hours])

  useEffect(() => {
    if (hourCustomComponentFn && hourCCIDs.length) {
      hours.forEach((hour, idx) => {
        const el = document.querySelector(`[data-ccid="${hourCCIDs[idx]}"]`)
        if (!(el instanceof HTMLElement)) {
          return console.warn(
            'Could not find element for custom component weekGridHour'
          )
        }

        hourCustomComponentFn(el, { hour })
      })
    }
  }, [hours, hourCCIDs])

  return (
    <>
      <div className="sx__week-grid__time-axis">
        {/* fixme: add logic for fullweedth */}
        {/* <TimeGridCurrentTimeIndicator $app={$app} date={$app.calendarState.range.value} isWeek /> */}

        {hours.map((hour, hourIndex) => (
          <div key={hourIndex} className="sx__week-grid__hour">
            {/* {hourCustomComponentFn && hourCCIDs.length > 0 && (
              <div data-ccid={hourCCIDs[hourIndex]} />
            )} */}
            {minutesInterval.array.map((_, i) => {
              const time = new Date(0, 0, 0, hour, i * minutesInterval.minute)

              return (
                <div key={i} className="sx__week-grid__minute-indicator">
                  <span className="sx__week-grid__hour-text-left">
                    {formatterMinutes.format(time)}
                  </span>
                  <span className="sx__week-grid__hour-text-right">
                    {formatterMinutes.format(time)}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
        {/* <span className={'sx__week-grid__time-cover'} /> */}
      </div>
    </>
  )
}
