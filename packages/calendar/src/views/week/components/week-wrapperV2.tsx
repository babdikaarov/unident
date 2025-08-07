// import { PreactViewComponent } from '@unimed-x/shared/src/types/calendar/preact-view-component'
// import TimeGridDay from '../../../components/week-grid/time-grid-day'
// // import TimeGridDayExp from '../../../components/week-grid/time-grid-day_exp'
// import TimeAxis from '../../../components/week-grid/time-axis'
// import { AppContext } from '../../../utils/stateful/app-context'
// import DateAxis from '../../../components/week-grid/date-axis'
// import { toJSDate } from '@unimed-x/shared/src/utils/stateless/time/format-conversion/format-conversion'
// import { sortEventsForWeekView } from '../../../utils/stateless/events/sort-events-for-week'
// import { createWeek } from '../../../utils/stateless/views/week/create-week'
// import { positionInTimeGrid } from '../../../utils/stateless/events/position-in-time-grid'
// import { positionInDateGrid } from '../../../utils/stateless/events/position-in-date-grid'
// import { sortEventsByStartAndEnd } from '../../../utils/stateless/events/sort-by-start-date'
// import { useComputed } from '@preact/signals'
// import { filterByRange } from '../../../utils/stateless/events/filter-by-range'
// import TimeGridDayWithStaff from '../../../components/week-grid/time-grid-day-with-staff'

// export const WeekWrapper: PreactViewComponent = ({ $app, id }) => {
//   document.documentElement.style.setProperty(
//     '--sx-week-grid-height',
//     `${$app.config.weekOptions.value.gridHeight}px`
//   )
//   const customComponent = $app.config._customComponentFns.timeGridDayStaffConent
//   const week = useComputed(() => {
//     const rangeStart = $app.calendarState.range.value?.start
//     const rangeEnd = $app.calendarState.range.value?.end
//     if (!rangeStart || !rangeEnd) return {}

//     let newWeek = createWeek($app)
//     const filteredEvents = $app.calendarEvents.filterPredicate.value
//       ? $app.calendarEvents.list.value.filter(
//           $app.calendarEvents.filterPredicate.value
//         )
//       : $app.calendarEvents.list.value
//     const { dateGridEvents, timeGridEvents } =
//       sortEventsForWeekView(filteredEvents)
//     newWeek = positionInDateGrid(
//       dateGridEvents.sort(sortEventsByStartAndEnd),
//       newWeek
//     )
//     Object.entries(newWeek).forEach(([date, day]) => {
//       day.backgroundEvents = filterByRange(
//         $app.calendarEvents.backgroundEvents.value,
//         {
//           start: date,
//           end: date,
//         }
//       )
//     })
//     newWeek = positionInTimeGrid(timeGridEvents, newWeek, $app)
//     return newWeek
//   })

//   return (
//     <>
//       <AppContext.Provider value={$app}>
//         <div className="sx__week-wrapper" id={id}>
//           <div className="sx__week-header">
//             <div className="sx__week-header-content">
//               <DateAxis
//                 week={Object.values(week.value).map((day) =>
//                   toJSDate(day.date)
//                 )}
//               />
//               <div className="sx__time-grid-day-staff-wrapper">
//                 <>
//                   <button
//                     style={{
//                       position: 'absolute',
//                       left: '-50px',
//                     }}
//                     onClick={() => $app.staffList.prev()}
//                   >
//                     Prev
//                   </button>

//                   {$app.staffList.listOnView.value.map((staff) => (
//                     {!customComponent ??

//                       <div className="sx__time-grid-day-staff">{staff.name}</div>
//                     }
//                   ))}

//                   <button
//                     style={{
//                       position: 'absolute',
//                       right: '-50px',
//                     }}
//                     onClick={() => $app.staffList.next()}
//                   >
//                     Next
//                   </button>
//                 </>
//               </div>

//               <div className="sx__week-header-border" />
//             </div>
//           </div>

//           <div className="sx__week-grid">
//             <TimeAxis />
//             <div className="sx__week-grid-staff">
//               {Object.values(week.value).map((day) => (
//                 <TimeGridDayWithStaff
//                   calendarEvents={day.timeGridEvents}
//                   backgroundEvents={day.backgroundEvents}
//                   date={day.date}
//                   key={day.date}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </AppContext.Provider>
//     </>
//   )
// }
