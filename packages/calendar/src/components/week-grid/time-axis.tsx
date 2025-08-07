import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
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

  useSignalEffect(() => {
    const newHours = getTimeAxisHours(
      $app.config.dayBoundaries.value,
      $app.config.isHybridDay
    )
    console.log('Generated Hours:', newHours)
    setHours(newHours)

    setMinutesInterval(getIntervalsPerHour($app.config.minuteBoudaries.value))

    const hoursPerDay = $app.config.timePointsPerDay / 100
    const pixelsPerHour = $app.config.weekOptions.value.gridHeight / hoursPerDay
    document.documentElement.style.setProperty(
      '--sx-week-grid-hour-height',
      `${pixelsPerHour}px`
    )
  })

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
