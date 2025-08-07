import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import { AppContext } from '../../utils/stateful/app-context'
import RangeHeading from './range-heading'
import { randomStringId } from '@unimed-x/shared/src'
import { getElementByCCID } from '../../utils/stateless/dom/getters'
import { viewWeek } from '../../views/week'
import { viewDay } from '../../views/day'
import WeekNumber from './week-number'
import ForwardBackwardNavigationAgenda from './forward-backward-navigation-agenda'

export default function CalendarHeaderAgenda() {
  const $app = useContext(AppContext)

  const headerContent = $app.config._customComponentFns.headerContent
  const headerContentId = useState(
    headerContent ? randomStringId() : undefined
  )[0]
  const headerContentLeftPrepend =
    $app.config._customComponentFns.headerContentLeftPrepend
  const headerContentLeftPrependId = useState(
    headerContentLeftPrepend ? randomStringId() : undefined
  )[0]
  const headerContentLeftAppend =
    $app.config._customComponentFns.headerContentLeftAppend
  const headerContentLeftAppendId = useState(
    headerContentLeftAppend ? randomStringId() : undefined
  )[0]
  const headerContentRightPrepend =
    $app.config._customComponentFns.headerContentRightPrepend
  const headerContentRightPrependId = useState(
    headerContentRightPrepend ? randomStringId() : undefined
  )[0]
  const headerContentRightAppend =
    $app.config._customComponentFns.headerContentRightAppend
  const headerContentRightAppendId = useState(
    headerContentRightAppend ? randomStringId() : undefined
  )[0]

  useEffect(() => {
    if (headerContent) {
      headerContent(getElementByCCID(headerContentId), { $app })
    }
    if (headerContentLeftPrepend && headerContentLeftPrependId) {
      headerContentLeftPrepend(getElementByCCID(headerContentLeftPrependId), {
        $app,
      })
    }
    if (headerContentLeftAppend) {
      headerContentLeftAppend(getElementByCCID(headerContentLeftAppendId), {
        $app,
      })
    }
    if (headerContentRightPrepend) {
      headerContentRightPrepend(getElementByCCID(headerContentRightPrependId), {
        $app,
      })
    }
    if (headerContentRightAppend) {
      headerContentRightAppend(getElementByCCID(headerContentRightAppendId), {
        $app,
      })
    }
  }, [
    $app.datePickerState.selectedDate.value,
    $app.calendarState.range.value,
    $app.calendarState.isDark.value,
    $app.calendarState.isCalendarSmall.value,
  ])

  const isDayOrWeekView = useMemo(() => {
    return [viewWeek.name, viewDay.name].includes($app.calendarState.view.value)
  }, [$app.calendarState.view.value])

  return (
    <header className={'sx__calendar-header'} data-ccid={headerContentId}>
      {!headerContent && (
        <>
          <div className={'sx__calendar-header-content-agenda'}>
            <RangeHeading key={$app.config.locale.value} />
            <ForwardBackwardNavigationAgenda />

            {$app.config.showWeekNumbers.value && isDayOrWeekView && (
              <WeekNumber />
            )}
          </div>
        </>
      )}
    </header>
  )
}
