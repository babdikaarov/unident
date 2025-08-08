import AppWrapper from '@unimed-x/date-picker/src/components/app-wrapper'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import { AppContext } from '../../utils/stateful/app-context'
import DatePickerAppSingletonBuilder from '@unimed-x/shared/src/utils/stateful/date-picker/app-singleton/date-picker-app-singleton.builder'
import RangeHeading from './range-heading'
import TodayButton from './today-button'
import ViewSelection from './view-selection'
import ForwardBackwardNavigation from './forward-backward-navigation'
import { randomStringId } from '@unimed-x/shared/src'
import { getElementByCCID } from '../../utils/stateless/dom/getters'
import { viewWeek } from '../../views/week'
import { viewDay } from '../../views/day'
import WeekNumber from './week-number'
// import { useSignalEffect } from '@preact/signals'
// import { useSignalEffect } from '@preact/signals'

export default function CalendarHeader() {
  const $app = useContext(AppContext)
  const datePickerAppSingleton = new DatePickerAppSingletonBuilder()
    .withDatePickerState($app.datePickerState)
    .withConfig($app.datePickerConfig)
    .withTranslate($app.translate)
    .withTimeUnitsImpl($app.timeUnitsImpl)
    .build()
  const minuteBoudaries = $app.config.minuteBoudaries
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

  const keyForRerenderingOnLocaleChange = $app.config.locale.value

  const isDayOrWeekView = useMemo(() => {
    return [viewWeek.name, viewDay.name].includes($app.calendarState.view.value)
  }, [$app.calendarState.view.value])

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    minuteBoudaries.value = Number(e.currentTarget.value)
  }

  return (
    <header className={'sx__calendar-header'} data-ccid={headerContentId}>
      {!headerContent && (
        <>
          <div className={'sx__calendar-header-content'}>
            {headerContentLeftPrependId && (
              <div data-ccid={headerContentLeftPrependId} />
            )}

            <TodayButton />

            <ForwardBackwardNavigation />

            <RangeHeading key={$app.config.locale.value} />

            {$app.config.showWeekNumbers.value && isDayOrWeekView && (
              <WeekNumber />
            )}

            {headerContentLeftAppendId && (
              <div data-ccid={headerContentLeftAppendId} />
            )}
          </div>

          <div className={'sx__calendar-header-content'}>
            {headerContentRightPrependId && (
              <div data-ccid={headerContentRightPrependId} />
            )}
            <div>
              <label htmlFor="interval">Select interval: </label>
              <select
                id="interval"
                name="interval"
                value={minuteBoudaries.value}
                onChange={handleChangeSelect}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={60}>60</option>
              </select>
            </div>
            <button
              onClick={() =>
                $app.staffList.addStaffList({
                  id: 'asd',
                  firstName: 'asd',
                })
              }
            >
              add
            </button>

            {$app.config.views.value.length > 1 && (
              <ViewSelection
                key={keyForRerenderingOnLocaleChange + '-view-selection'}
              />
            )}

            <AppWrapper $app={datePickerAppSingleton}></AppWrapper>

            {headerContentRightAppendId && (
              <div data-ccid={headerContentRightAppendId} />
            )}
          </div>
        </>
      )}
    </header>
  )
}
