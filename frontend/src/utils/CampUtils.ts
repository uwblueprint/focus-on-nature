import { format } from "date-fns";
import {
  CampResponse,
  CampSession,
  CampStatus,
  CreateCampSession,
  Location,
  QuestionType,
} from "../types/CampsTypes";

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

export const ongoingSession = (session: CampSession): boolean => {
  const today = new Date();
  const lastDay = new Date(session.dates[session.dates.length - 1]);
  return today <= lastDay;
};

export const getCampStatus = (camp: CampResponse): CampStatus => {
  if (!camp.active) {
    return CampStatus.DRAFT;
  }
  if (camp.campSessions.some(ongoingSession)) {
    return CampStatus.PUBLISHED;
  }
  return CampStatus.COMPLETED;
};

export const getFormattedDateString = (dates: Array<string>): string => {
  const startDate = new Date(dates[0]).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
  const endDate = new Date(dates[dates.length - 1]).toLocaleDateString(
    "en-us",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return `${startDate} - ${endDate}`;
};

export const getFormattedDateStringFromDateArray = (dates: Date[]): string => {
  const startDate = dates[0].toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
  const endDate = dates[dates.length - 1].toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return `${startDate} - ${endDate}`;
};

export const getFormattedSessionDatetime = (
  dates: Array<string>,
  startTime: string,
  endTime: string,
): string => `${getFormattedDateString(dates)} | ${startTime} - ${endTime}`;

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
    // only add days that the user selected
    // e.g. only add Mondays - Fridays dates, don't add weekends
    if (selectedWeekDayValues[currDay]) {
      const newDate = new Date(sessionStartDate.getTime());
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
