// import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
// import { AppContext } from '../../utils/stateful/app-context'
// import {
//   getIntervalsPerHour,
//   getTimeAxisHours,
// } from '../../utils/stateless/time/time-axis/time-axis'
// import { useSignalEffect } from '@preact/signals'
// import { randomStringId } from '@unimed-x/shared/src'
// // import TimeGridCurrentTimeIndicator from './time-grid-current-indicator'

// export default function TimeAxisStaffColumn() {
//   const $app = useContext(AppContext)
//   const [hours, setHours] = useState<number[]>([])
//   const fiveMinuteGrid = Array.from({ length: 60 / 5 }, (_, i) => i)

//   useSignalEffect(() => {
//     const newHours = getTimeAxisHours(
//       $app.config.dayBoundaries.value,
//       $app.config.isHybridDay
//     )
//     setHours(newHours)
//   })

//   return (
//     <>
//       <div className="sx__week-grid__time-axis_staff">
//         {hours.map((_hour, hourIndex) => (
//           <div key={hourIndex} className="sx__week-grid__hour_staff">
//             {fiveMinuteGrid.map((_, i) => {
//               return (
//                 <div
//                   key={i}
//                   className={'sx__week-grid__minute-indicator_for_staff'}
//                 ></div>
//               )
//             })}
//           </div>
//         ))}
//       </div>
//     </>
//   )
// }
