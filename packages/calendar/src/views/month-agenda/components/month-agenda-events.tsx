import { useContext, useState } from 'preact/hooks'
import { CalendarEventInternal } from '@unimed-x/shared/src/interfaces/calendar/calendar-event.interface'
import MonthAgendaEvent from './month-agenda-event'
import { AppContext } from '../../../utils/stateful/app-context'
import { signal, useSignal } from '@preact/signals'

type Props = {
  events: CalendarEventInternal[]
}
const isOpen = signal(false)

export default function MonthAgendaEvents({ events }: Props) {
  const $app = useContext(AppContext)

  return (
    <div className="sx__month-agenda-events-wrapper">
      <button
        type="button"
        className={`sx__month-agenda-dropdown-btn${isOpen.value ? ' is-open' : ''}`}
        onClick={() => (isOpen.value = !isOpen.value)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isOpen.value
          ? $app.translate('Hide Events')
          : $app.translate('Show Events')}
        <span className="sx__month-agenda-arrow" aria-hidden="true" />
      </button>

      {isOpen.value && (
        <div className="sx__month-agenda-events">
          {events.length ? (
            events.map((event) => (
              <MonthAgendaEvent calendarEvent={event} key={event.id} />
            ))
          ) : (
            <div className="sx__month-agenda-events__empty">
              {$app.translate('No events')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
