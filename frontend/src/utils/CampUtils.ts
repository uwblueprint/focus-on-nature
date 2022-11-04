import {
  CampResponse,
  CampSession,
  CampStatus,
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

export const campStatus = (camp: CampResponse): CampStatus => {
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

export const getFormattedSessionDatetime = (
  dates: Array<string>,
  startTime: string,
  endTime: string,
): string => `${getFormattedDateString(dates)} | ${startTime} - ${endTime}`;


export const getTextFromQuestionType = (questionType: QuestionType) : string => {
  switch(questionType) {
    case "MultipleChoice":
        return "Multiple Choice"
    case "Multiselect":
        return "Checkbox"
    case "Text":
        return "Short Answer"
    default:
        return ""
  }
}