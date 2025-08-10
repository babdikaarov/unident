import { CustomComponentFn } from './calendar-config'

export type CustomComponentName =
  | 'timeGridEvent'
  | 'dateGridEvent'
  | 'monthGridEvent'
  | 'monthAgendaEvent'
  | 'eventModal'
  | 'headerContentLeftPrepend'
  | 'headerContentLeftAppend'
  | 'headerContentRightPrepend'
  | 'headerContentRightAppend'
  | 'headerContent'
  | 'interactiveModalAdditionalFields'
  | 'weekGridDate'
  | 'weekGridHour'
  | 'monthGridDayName'
  | 'monthGridDate'
  | 'timeGridDayStaffConent'
  | 'noStaffFound'

export type CustomComponentFns = {
  [key in CustomComponentName]?: CustomComponentFn
}

export type ReactComponentFns = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in CustomComponentName]?: React.FC<any>
}
