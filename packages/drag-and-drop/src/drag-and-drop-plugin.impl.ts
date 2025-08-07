import DragAndDropPlugin from '@unimed-x/shared/src/interfaces/drag-and-drop/drag-and-drop-plugin.interface'
import { PluginName } from '@unimed-x/shared/src/enums/plugin-name.enum'
import TimeGridDragHandlerImpl from './time-grid-drag-handler.impl'
import { DayBoundariesDateTime } from '@unimed-x/shared/src/types/day-boundaries-date-time'
import DateGridDragHandler from '@unimed-x/shared/src/interfaces/drag-and-drop/date-grid-drag-handler.interface'
import DateGridDragHandlerImpl from './date-grid-drag-handler.impl'
import MonthGridDragHandlerImpl from './month-grid-drag-handler.impl'
import MonthGridDragHandler from '@unimed-x/shared/src/interfaces/drag-and-drop/month-grid-drag-handler.interface'
import { CalendarEventInternal } from '@unimed-x/shared/src/interfaces/calendar/calendar-event.interface'
import CalendarAppSingleton from '@unimed-x/shared/src/interfaces/calendar/calendar-app-singleton'
import TimeGridDragHandler from '@unimed-x/shared/src/interfaces/drag-and-drop/time-grid-drag-handler.interface'
import DragHandlerDependencies from '@unimed-x/shared/src/interfaces/drag-and-drop/drag-handler-dependencies.interface'
import { definePlugin } from '@unimed-x/shared/src/utils/stateless/calendar/define-plugin'

class DragAndDropPluginImpl implements DragAndDropPlugin {
  name = PluginName.DragAndDrop

  onRender($app: CalendarAppSingleton) {
    if (!$app.elements.calendarWrapper) return

    $app.elements.calendarWrapper.dataset.hasDnd = 'true'
  }

  constructor(private minutesPerInterval: number) {}

  createTimeGridDragHandler(
    dependencies: DragHandlerDependencies,
    dayBoundariesDateTime: DayBoundariesDateTime
  ): TimeGridDragHandler {
    return new TimeGridDragHandlerImpl(
      dependencies.$app,
      dependencies.eventCoordinates,
      dependencies.eventCopy,
      dependencies.updateCopy,
      dayBoundariesDateTime,
      this.getTimePointsForIntervalConfig()
    )
  }

  private getTimePointsForIntervalConfig(): number {
    if (this.minutesPerInterval === 60) return 100
    if (this.minutesPerInterval === 30) return 50
    return 25
  }

  createDateGridDragHandler(
    dependencies: DragHandlerDependencies
  ): DateGridDragHandler {
    return new DateGridDragHandlerImpl(
      dependencies.$app,
      dependencies.eventCoordinates,
      dependencies.eventCopy,
      dependencies.updateCopy
    )
  }

  createMonthGridDragHandler(
    calendarEvent: CalendarEventInternal,
    $app: CalendarAppSingleton
  ): MonthGridDragHandler {
    return new MonthGridDragHandlerImpl(calendarEvent, $app)
  }
}

export const createDragAndDropPlugin = (minutesPerInterval = 15) => {
  return definePlugin(
    'dragAndDrop',
    new DragAndDropPluginImpl(minutesPerInterval)
  ) as DragAndDropPluginImpl & {
    name: PluginName.DragAndDrop
  }
}
