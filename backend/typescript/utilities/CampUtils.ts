// The start and end time of a camp is stored as a string in format hh::mm

import { Camp } from "../models/camp.model";

// convertCampTimingToDate returns the start and end time attached to a particular date
export function convertCampTimingToDate(
  date: Date,
  estStartTime: string,
): Date {
  const [hours, minutes] = estStartTime.split(":"); // based on 24h string like `9:30`
  const estTimeZoneOffset = 5; // TODO consider EDT

  const startTimeDate = new Date(date.getTime());
  startTimeDate.setUTCHours(
    parseInt(hours, 10) + estTimeZoneOffset,
    parseInt(minutes, 10),
  );
  // console.log(startTimeDate);
  return startTimeDate;
}

// Calculates total cost of early dropoff from the given timings
export function getEDUnits(edDates: string[], camp: Camp): number {
  if (edDates.length === 0) return 0;

  const dates: Date[] = edDates.map((dateString) => new Date(dateString));
  return dates
    .map((edDate) => {
      const startTime = convertCampTimingToDate(edDate, camp.startTime);
      console.log(edDate);
      console.log(startTime);
      // get the number of seconds between the ED time and start time
      let timeDiff: number = (startTime.getTime() - edDate.getTime()) / 1000;
      // convert to number of minutes
      timeDiff /= 60;
      // Get the number of 30 minute timeslots.
      // This should always be in 30 min intervals from frontend, but we round up in case
      const edSlots = Math.ceil(timeDiff / 30);
      return edSlots;
    })
    .reduce((totalSlots, slots) => totalSlots + slots, 0);
}

// Calculates total cost of late pickup from the given timings
export function getLPUnits(lpDates: string[], camp: Camp): number {
  if (lpDates.length === 0) return 0;

  const dates: Date[] = lpDates.map((dateString) => new Date(dateString));

  return dates
    .map((lpDate) => {
      const endTime = convertCampTimingToDate(lpDate, camp.endTime);
      // get the number of seconds between the ED time and start time
      let timeDiff: number = (lpDate.getTime() - endTime.getTime()) / 1000;
      // convert to number of minutes
      timeDiff /= 60;
      // Get the number of 30 minute timeslots.
      // This should always be in 30 min intervals from frontend, but we round up in case
      const lpSlots = Math.ceil(timeDiff / 30);
      return lpSlots;
    })
    .reduce((totalSlots, slots) => totalSlots + slots, 0);
}
