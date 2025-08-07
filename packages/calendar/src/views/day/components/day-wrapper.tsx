import { PreactViewComponent } from '@unimed-x/shared/src/types/calendar/preact-view-component'
import { WeekWrapperOrigin } from '../../week/components/week-wrapper-origin'
import { WeekWrapper } from '../../week/components/week-wrapper'

export const DayWrapper: PreactViewComponent = ({ $app, id }) => {
  const TypeWeekWrapper = $app.staffList.hasList
    ? WeekWrapper
    : WeekWrapperOrigin
  return <TypeWeekWrapper $app={$app} id={id} />
}
