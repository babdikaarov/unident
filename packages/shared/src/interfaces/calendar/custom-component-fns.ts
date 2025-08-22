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
  | 'weekGridDateStaff'
  | 'weekGridHour'
  | 'monthGridDayName'
  | 'monthGridDate'
  | 'timeGridDayStaffConent'
  | 'timeGridDayStaffConentWeek'
  | 'noStaffFound'
  | 'navigationStaff'
  // | 'navigationDay'
  // | 'navigationWeek'
  // | 'navigationMonth'
  | string

export type CustomComponentFns = {
  [key in CustomComponentName]?: CustomComponentFn
}
