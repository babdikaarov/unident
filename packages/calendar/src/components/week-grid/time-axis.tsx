import { useContext, useEffect, useMemo, useState, useRef } from 'preact/hooks'
import { AppContext } from '../../utils/stateful/app-context'
import {
  getIntervalsPerHour,
  getTimeAxisHours,
} from '../../utils/stateless/time/time-axis/time-axis'
import { useSignalEffect } from '@preact/signals'
import { randomStringId } from '@unimed-x/shared/src'
// import TimeGridCurrentTimeIndicator from './time-grid-current-indicator'

export default function TimeAxis() {
  const $app = useContext(AppContext)
  const [hours, setHours] = useState<number[]>([])
  const [minutesInterval, setMinutesInterval] = useState<{
    array: number[]
    minute: number
  }>(getIntervalsPerHour($app.config.minuteBoudaries.value))

  // Store the base grid height (before any minute boundary scaling)
  const [baseGridHeight, setBaseGridHeight] = useState<number>(
    $app.config.weekOptions.value.gridHeight
  )

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

  // Handle minute boundary changes with smooth scaling
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
      duration: number = 200
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

    // Calculate the scaling factor
    const previousRatio = 60 / previousMinuteBounds // intervals per hour for previous
    const currentRatio = 60 / currentMinuteBoundaries // intervals per hour for current
    const scaleFactor = currentRatio / previousRatio
    const currentGridHeight = $app.config.weekOptions.value.gridHeight

    // Sensitivity configuration
    const sensitivity = 0.35 // Range: 0.0 (no change) to 1.0 (full change)

    // SOLUTION 1: Use base height for consistent scaling (recommended)
    // Calculate target height based on base height to avoid ratcheting
    const currentScale = 60 / currentMinuteBoundaries
    const baseScale = 60 / 15 // Assume 15min as base reference
    const targetHeightFromBase =
      baseGridHeight * (currentScale / baseScale) ** sensitivity

    // SOLUTION 2: Alternative - Use logarithmic scaling for symmetric behavior
    // const adjustedScaleFactor = Math.pow(scaleFactor, sensitivity)
    // const targetHeight = currentGridHeight * adjustedScaleFactor

    // SOLUTION 3: Alternative - Store and use absolute height mapping
    // const heightSteps = {
    //   60: baseGridHeight * 0.5,
    //   30: baseGridHeight * 0.7,
    //   15: baseGridHeight * 1.0,
    //   10: baseGridHeight * 1.3,
    //   5: baseGridHeight * 1.8
    // }
    // const targetHeight = heightSteps[currentMinuteBoundaries] || targetHeightFromBase

    // Use base-height solution for consistent scaling
    const targetHeight = targetHeightFromBase

    // Safety bounds
    const MIN_HEIGHT_RATIO = 0.3
    const MAX_HEIGHT_RATIO = 3.0
    const boundedTargetHeight = Math.max(
      baseGridHeight * MIN_HEIGHT_RATIO,
      Math.min(baseGridHeight * MAX_HEIGHT_RATIO, targetHeight)
    )

    // Debug logging
    console.log(
      `Minute boundaries: ${previousMinuteBounds} -> ${currentMinuteBoundaries}`
    )
    console.log(
      `Ratios: ${previousRatio.toFixed(2)} -> ${currentRatio.toFixed(2)}`
    )
    console.log(`Raw scale factor: ${scaleFactor.toFixed(3)}`)
    console.log(`Base height: ${baseGridHeight.toFixed(0)}`)
    console.log(
      `Current scale: ${currentScale.toFixed(2)}, Base scale: ${baseScale.toFixed(2)}`
    )
    console.log(
      `Scale ratio: ${(currentScale / baseScale).toFixed(3)} -> Powered: ${((currentScale / baseScale) ** sensitivity).toFixed(3)}`
    )
    console.log(
      `Direction: ${scaleFactor > 1 ? 'INCREASING' : 'DECREASING'} height`
    )
    console.log(
      `Height: ${currentGridHeight.toFixed(0)} -> ${boundedTargetHeight.toFixed(0)}`
    )
    console.log('---')

    // Animate the change
    animateGridHeightChange(currentGridHeight, boundedTargetHeight)

    // Update the previous minute boundaries
    previousMinuteBoundaries.current = currentMinuteBoundaries

    // Update base height if this is the first change
    if (
      Math.abs(baseGridHeight - $app.config.weekOptions.value.gridHeight) < 10
    ) {
      // If current height is close to what we think is base, recalculate base
      const estimatedBase =
        currentGridHeight /
        (60 / previousMinuteBounds / baseScale) ** sensitivity
      setBaseGridHeight(estimatedBase)
    }
  }, [$app.config.minuteBoudaries.value])

  // Update base grid height when week options change externally (like zoom)
  useEffect(() => {
    const currentMinuteBoundaries = $app.config.minuteBoudaries.value
    const currentGridHeight = $app.config.weekOptions.value.gridHeight

    // Only update base height if we're not currently animating a minute boundary change
    if (!isAnimating) {
      // Calculate what the base height should be for current minute boundaries
      const currentScale = 60 / currentMinuteBoundaries
      const baseScale = 60 / 15 // Use consistent base scale

      // Reverse the scaling to get the base height
      const calculatedBaseHeight =
        currentGridHeight / (currentScale / baseScale) ** 0.35
      setBaseGridHeight(calculatedBaseHeight)

      console.log(`External height change detected: ${currentGridHeight}`)
      console.log(
        `Calculated base height: ${calculatedBaseHeight.toFixed(0)} (for ${currentMinuteBoundaries}min intervals)`
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
        <span className={'sx__week-grid__time-cover'} />
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
      </div>
    </>
  )
}
