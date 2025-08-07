import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'
import { render } from '@testing-library/preact'
import { AppContext } from '../../../../utils/stateful/app-context'
import { WeekWrapperOrigin } from '../week-wrapper-origin'
import { WeekWrapper } from '../week-wrapper'

export const renderComponent = ($app: CalendarAppSingleton) => {
  if ($app.staffList.list.value?.length) {
    render(
      <AppContext.Provider value={$app}>
        <WeekWrapper $app={$app} id={'1'} />
      </AppContext.Provider>
    )
  } else {
    render(
      <AppContext.Provider value={$app}>
        <WeekWrapperOrigin $app={$app} id={'1'} />
      </AppContext.Provider>
    )
  }
}
