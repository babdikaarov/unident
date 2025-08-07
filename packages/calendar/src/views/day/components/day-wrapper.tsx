import { PreactViewComponent } from '@unimed-x/shared/src/types/calendar/preact-view-component'
import { WeekWrapperOrigin } from '../../week/components/week-wrapper-origin'
import { WeekWrapper } from '../../week/components/week-wrapper'

export const DayWrapper: PreactViewComponent = ({ $app, id }) => {
  if ($app.staffList.list.value?.length) {
    return <WeekWrapper $app={$app} id={id} />
  } else {
    return <WeekWrapperOrigin $app={$app} id={id} />
  }
}
