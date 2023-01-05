import { format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import {
  checkEmail,
  checkFirstName,
  checkLastName,
  checkPhoneNumber,
  checkRelationToCamper,
} from "../components/pages/RegistrantExperience/RegistrationSteps/PersonalInfo/personalInfoReducer";
import MONTHS from "../constants/CampManagementConstants";
import { EDLP_PLACEHOLDER_TIMESLOT } from "../constants/RegistrationConstants";
import { BORDER_COLORS, FILL_COLORS } from "../theme/colors";
import {
  CreateCamperDTO,
  RegistrantExperienceCamper,
} from "../types/CamperTypes";
import {
  CampResponse,
  CampSession,
  CampStatus,
  CreateCampSession,
  CreateUpdateCampRequest,
  Location,
  QuestionType,
} from "../types/CampsTypes";
import { EdlpChoice } from "../types/RegistrationTypes";
import { OptionalClauseResponse } from "../types/waiverRegistrationTypes";

export const CampStatusColor = {
  [CampStatus.DRAFT]: "yellow",
  [CampStatus.COMPLETED]: "red",
  [CampStatus.PUBLISHED]: "green",
};

export const locationString = (location: Location): string => {
  if (!location) {
    return "";
  }
  return `${location.streetAddress1}, ${location.streetAddress2 ?? ""}
    ${location.city} ${location.province}, ${location.postalCode}`;
};

const sessionCompleted = (session: CampSession): boolean =>
  session.dates.every((date) => new Date(date) < new Date());

export const getCampStatus = (camp: CampResponse): CampStatus => {
  if (!camp.active) {
    return CampStatus.DRAFT;
  }

  if (camp.campSessions.every(sessionCompleted)) {
    return CampStatus.COMPLETED;
  }

  return CampStatus.PUBLISHED;
};

export const sortDates = (dates: Date[]): Date[] =>
  dates.sort((a, b) => a.getTime() - b.getTime());

export const sortDatestrings = (dates: string[]): string[] =>
  dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

// Takes a 24 hour time string and converts it to AM/PM time
export const formatAMPM = (time: string): string => {
  const date = new Date(`1/1/2022 ${time}`);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getFormattedSingleDateString = (date: string): string => {
  const dateString = new Date(date).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return dateString;
};

// returns in the form "Jan 1 - Feb 2, 2022"
export const getFormattedDateRangeStringFromDateArray = (
  dates: Date[],
): string => {
  if (dates.length === 0) return "No dates selected";

  const orderedDates = sortDates(dates);
  const startDate = orderedDates[0].toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
  const endDate = orderedDates[orderedDates.length - 1].toLocaleDateString(
    "en-us",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return `${startDate} - ${endDate}`;
};

export const getFormattedDateRangeStringFromStringArray = (
  dates: Array<string>,
): string =>
  getFormattedDateRangeStringFromDateArray(dates.map((date) => new Date(date)));

export const getFormattedSessionDatetime = (
  dates: Array<string>, // array is ordered ascendingly in `getFormattedDateRangeStringFromStringArray`
  startTime: string,
  endTime: string,
): string => {
  const dateRange = getFormattedDateRangeStringFromStringArray(dates);
  return `${dateRange} | ${startTime} - ${endTime}`;
};

export const sortScheduledSessions = (
  sessions: CreateCampSession[],
): CreateCampSession[] => {
  return sessions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

export const getSessionDates = (
  sessionStartDate: Date,
  selectedWeekDayValues: boolean[],
): Date[] => {
  const dates: Date[] = [];

  let currDay = sessionStartDate.getDay();
  for (
    let daysAfterStartDate = 0;
    daysAfterStartDate < 7;
    daysAfterStartDate += 1
  ) {
    // only add dates corresponding to selected weekdays
    // e.g. only add Mondays - Fridays dates, don't add weekends
    if (selectedWeekDayValues[currDay]) {
      const newDate = new Date(sessionStartDate.getTime()); // creates deep copy
      newDate.setDate(newDate.getDate() + daysAfterStartDate);
      dates.push(newDate);
    }
    currDay = (currDay + 1) % 7;
  }
  return dates;
};

export const getTextFromQuestionType = (questionType: QuestionType): string => {
  switch (questionType) {
    case "MultipleChoice":
      return "Multiple Choice";
    case "Multiselect":
      return "Checkbox";
    case "Text":
      return "Short Answer";
    default:
      return "";
  }
};

export const getFormattedCampDateRange = (
  firstCampSessionDates: Array<string>,
  lastCampSessionDates: Array<string>,
): string => {
  if (firstCampSessionDates && lastCampSessionDates) {
    const startDate = format(new Date(firstCampSessionDates[0]), "PP");
    const lastDate = format(
      new Date(lastCampSessionDates[lastCampSessionDates.length - 1]),
      "PP",
    );
    return `${startDate} - ${lastDate}`;
  }
  return "";
};

const getWeekDayKeyFromDateNum = (num: number): string => {
  switch (num) {
    case 0:
      return "Su";
    case 1:
      return "Mo";
    case 2:
      return "Tu";
    case 3:
      return "We";
    case 4:
      return "Th";
    case 5:
      return "Fr";
    default:
      return "Sa";
  }
};

// getSelectedWeekDaysFromDates takes an array of Dates and returns map of weekdays,
// with value of true if camp session occurs on this weekday, otherwise false.
// All camp sessions occur over a single week period.
export const getSelectedWeekDaysFromDates = (
  sessionDates: Date[],
): Map<string, boolean> => {
  const campDays = new Map<string, boolean>([
    ["Su", false],
    ["Mo", false],
    ["Tu", false],
    ["We", false],
    ["Th", false],
    ["Fr", false],
    ["Sa", false],
  ]);

  sessionDates.forEach((date) => {
    const key = getWeekDayKeyFromDateNum(date.getDay());
    campDays.set(key, true);
  });

  return campDays;
};

export const getMonthIndex = (month: string): number => MONTHS[month];

export const getMonthName = (date: Date): string =>
  date.toLocaleString("en-US", { month: "long" });

export const getYearsArray = (): string[] => {
  const todayYear = new Date().getFullYear();

  // Calendar component has year picker for present to 10 years from now
  const yearStrings = Array.from({ length: 10 }, (_v, index) =>
    (index + todayYear).toString(),
  );

  return yearStrings;
};

export const getSessionBorderColor = (sessionIndex: number): string =>
  BORDER_COLORS[sessionIndex % 8];

export const getSessionFillColor = (sessionIndex: number): string =>
  FILL_COLORS[sessionIndex % 8];

// isEDLPValid checks if the EDLP config in the request object is valid
const isEDLPValid = (camp: CreateUpdateCampRequest): boolean => {
  // Camp either doesn't have EDLP or has both
  if (
    (camp.earlyDropoff && !camp.latePickup) ||
    (camp.latePickup && !camp.earlyDropoff)
  ) {
    return false;
  }
  // Camp must have both late pickup and early dropoff fee if it has EDLP
  if (
    camp.earlyDropoff &&
    camp.latePickup &&
    (!camp.dropoffFee || !camp.pickupFee)
  ) {
    return false;
  }
  return true;
};

// isMinCampDetailsFilled checks if the camp object has the minimum details required to create/update a camp
export const isMinCampDetailsFilled = (
  camp: CreateUpdateCampRequest,
): boolean => {
  if (
    camp.name &&
    camp.description &&
    camp.fee &&
    camp.startTime &&
    camp.endTime &&
    camp.ageLower &&
    camp.ageUpper &&
    isEDLPValid(camp) &&
    camp.location.streetAddress1 &&
    camp.location.city &&
    camp.location.province &&
    camp.location.province &&
    camp.location.postalCode &&
    camp.campSessions.length > 0 &&
    camp.campSessions.every((cs) => cs.capacity > 0)
  ) {
    return true;
  }
  return false;
};

export const getMeridianTime = (time: string): string => {
  const trimmedString = time.trim();
  if (!trimmedString) {
    return "Unknown";
  }

  const [hourString, minutesString] = trimmedString.split(":");
  const hour = parseInt(hourString, 10);
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  return `${adjustedHour}:${minutesString}${hour < 12 ? "AM" : "PM"}`;
};

// Create date string if EDLP available in this slot
const getEdlpDateString = (
  timeSlot: string,
  dateString: string,
): string | undefined => {
  try {
    if (timeSlot === EDLP_PLACEHOLDER_TIMESLOT) {
      throw new Error("No EDLP selected");
    }

    // Expect Meridian time string, 9:30 AM
    const [hours, minutes, meridiem] = timeSlot.split(/:|\s/);
    const edlpDay = new Date(dateString);
    const adjustedDate = new Date(
      edlpDay.getFullYear(),
      edlpDay.getMonth(),
      edlpDay.getDate(),
      meridiem === "AM" ? parseInt(hours, 10) : parseInt(hours, 10) + 12,
      parseInt(minutes, 10),
    );

    return zonedTimeToUtc(adjustedDate, "America/Toronto").toString();
  } catch (error: unknown) {
    return undefined;
  }
};

export const mapToCreateCamperDTO = (
  campers: RegistrantExperienceCamper[],
  edlpChoices: EdlpChoice[][],
  optionalClauses: OptionalClauseResponse[],
): CreateCamperDTO[] => {
  const earlyDropoff = edlpChoices.flatMap((sessionChoices) => {
    return sessionChoices.reduce((dates: string[], edlpChoice) => {
      const edDate = getEdlpDateString(
        edlpChoice.earlyDropoff.timeSlot,
        edlpChoice.date,
      );

      if (edDate) {
        dates.push(edDate);
      }

      return dates;
    }, []);
  });

  const latePickup = edlpChoices.flatMap((sessionChoices) => {
    return sessionChoices.reduce((dates: string[], edlpChoice) => {
      const lpDate = getEdlpDateString(
        edlpChoice.latePickup.timeSlot,
        edlpChoice.date,
      );

      if (lpDate) {
        dates.push(lpDate);
      }

      return dates;
    }, []);
  });

  return campers.map((camper) => {
    const camperDTO = {
      ...camper,
      earlyDropoff,
      latePickup,
      optionalClauses: optionalClauses.map((optionalClause) => {
        return {
          clause: optionalClause.text,
          // Type may be undefined, but frontend enforces this not being undefined
          agreed: optionalClause.agreed === true,
        };
      }),
      formResponses: camper.formResponses
        ? Object.fromEntries(camper.formResponses)
        : undefined,
    };

    if (camperDTO.contacts.length === 2) {
      const [firstContact, secondContact] = camperDTO.contacts;
      // Remove second contact if empty
      // TODO show error states if second contact partially filled
      if (
        !(
          checkFirstName(secondContact.firstName) &&
          checkLastName(secondContact.lastName) &&
          checkEmail(secondContact.email) &&
          checkPhoneNumber(secondContact.phoneNumber) &&
          checkRelationToCamper(secondContact.relationshipToCamper)
        )
      ) {
        camperDTO.contacts = [firstContact];
      }
    }

    return camperDTO;
  });
};

export const sessionIsInProgressOrCompleted = (
  campSession: CampSession,
): boolean =>
  campSession.dates.some((dateString) => new Date(dateString) <= new Date());
