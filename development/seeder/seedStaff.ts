import * as fs from 'fs'
import { seededEvents } from '../data/seeded-events'
import { StaffBase } from '@unimed-x/shared/src/interfaces/calendar/calendar-staff.interface'

export const generateStaffSeed = () => {
  const staffMap = new Map<string, StaffBase>()

  // Loop through all events
  for (const event of seededEvents) {
    if (event.withStaff && !staffMap.has(event.withStaff.id)) {
      staffMap.set(event.withStaff.id, {
        id: event.withStaff.id,
        firstName: event.withStaff.firstName,
      })
    }
  }

  const staffArray = Array.from(staffMap.values())

  const payload = new Uint8Array(
    Buffer.from(
      `export const staffSeed = ${JSON.stringify(staffArray, null, 2)}\n`
    )
  )

  fs.writeFile('./development/data/staff-seed.ts', payload, (err: unknown) => {
    if (err) console.error(err)
    else
      console.log(
        `staff-seed.ts generated withStaff ${staffArray.length} staff members`
      )
  })
}

generateStaffSeed()
