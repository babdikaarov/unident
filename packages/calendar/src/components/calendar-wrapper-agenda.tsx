import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'
import { AppContext } from '../utils/stateful/app-context'
import { useEffect, useState } from 'preact/hooks'
import { View } from '@unimed-x/shared/src/types/calendar/view'
import { randomStringId } from '@unimed-x/shared/src/utils/stateless/strings/random'
import { setWrapperElement } from '../utils/stateless/dom/set-wrapper-element'
import { handleWindowResize } from '../utils/stateless/dom/handle-window-resize'
import useWrapperClasses from '../utils/stateful/hooks/use-wrapper-classes'
import {
  destroyPlugins,
  initPlugins,
} from '../utils/stateless/plugins-lifecycle'
import { useSignalEffect } from '@preact/signals'
import { InternalViewName } from '@unimed-x/shared/src/enums/calendar/internal-view.enum'
import CalendarHeaderAgenda from './header/calendar-header-agenda'

type props = {
  $app: CalendarAppSingleton
}

export default function CalendarWrapperAgenda({ $app }: props) {
  const calendarId = randomStringId()
  const viewContainerId = randomStringId()

  useEffect(() => {
    setWrapperElement($app, calendarId)
    initPlugins($app)

    if ($app.config.callbacks?.onRender) {
      $app.config.callbacks.onRender($app)
    }

    return () => destroyPlugins($app)
  }, [])

  const onResize = () => {
    handleWindowResize($app)
  }

  useEffect(() => {
    if ($app.config.isResponsive) {
      onResize()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
  }, [])

  const wrapperClasses = useWrapperClasses($app)

  const [currentView, setCurrentView] = useState<View | null>()

  useSignalEffect(() => {
    const newView = $app.config.views.value.find(
      (view) => view.name === $app.calendarState.view.value
    )
    const viewElement = document.getElementById(viewContainerId)

    if (!newView || !viewElement || newView.name === currentView?.name) return

    if (currentView) currentView.destroy()
    setCurrentView(newView)
    newView.render(viewElement, $app)
  })

  const [previousRangeStart, setPreviousRangeStart] = useState('')
  const [transitionClass, setTransitionClass] = useState('')

  useSignalEffect(() => {
    // There is no reason to transition sideways, because the list view is expanded vertically, unlike the other views
    if ($app.calendarState.view.value === InternalViewName.List) return

    const newRangeStartIsLaterThanPrevious =
      ($app.calendarState.range.value?.start || '') > previousRangeStart

    if (!$app.calendarState.isLoading.value) {
      setTransitionClass(
        newRangeStartIsLaterThanPrevious ? 'sx__slide-left' : 'sx__slide-right'
      )

      setTimeout(() => {
        setTransitionClass('')
      }, 300)
    }
    // CORRELATION ID: 3
    setPreviousRangeStart($app.calendarState.range.value?.start || '')
  })

  useSignalEffect(() => {
    $app.datePickerConfig.locale.value = $app.config.locale.value
  })
  return (
    <>
      <div className={wrapperClasses.join(' ')} id={calendarId}>
        <div className={'sx__calendar'}>
          <AppContext.Provider value={$app}>
            {$app.calendarState.view.value === 'monthly-agenda' ? null : (
              <CalendarHeaderAgenda />
            )}
            <div
              className={['sx__view-container', transitionClass].join(' ')}
              id={viewContainerId}
            ></div>

            {$app.config.plugins.eventModal &&
              $app.config.plugins.eventModal.calendarEvent.value && (
                <$app.config.plugins.eventModal.ComponentFn
                  $app={$app}
                  key={$app.config.plugins.eventModal.calendarEvent.value?.id}
                />
              )}
          </AppContext.Provider>
        </div>
      </div>
    </>
  )
}
