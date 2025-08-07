import { toJSDate } from '@unimed-x/shared/src/utils/stateless/time/format-conversion/format-conversion'

export const getDurationInMinutes = (
  dtstart: string,
  dtend: string
): number => {
  const dtStartJS = toJSDate(dtstart)
  const dtEndJS = toJSDate(dtend)
  return (dtEndJS.getTime() - dtStartJS.getTime()) / 1000 / 60
}
