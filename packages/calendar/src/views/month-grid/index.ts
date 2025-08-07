import { createPreactView } from '../../utils/stateful/preact-view/preact-view'
import { InternalViewName } from '@unimed-x/shared/src/enums/calendar/internal-view.enum'
import { setRangeForMonth } from '../../utils/stateless/time/range/set-range'
import { MonthGridWrapper } from './components/month-grid-wrapper'
import { addMonths } from '@unimed-x/shared/src/utils/stateless/time/date-time-mutation/adding'

const config = {
  name: InternalViewName.MonthGrid,
  label: 'Month',
  setDateRange: setRangeForMonth,
  Component: MonthGridWrapper,
  hasWideScreenCompat: true,
  hasSmallScreenCompat: false,
  backwardForwardFn: addMonths,
  backwardForwardUnits: 1,
}
export const viewMonthGrid = createPreactView(config)
export const createViewMonthGrid = () => createPreactView(config)
