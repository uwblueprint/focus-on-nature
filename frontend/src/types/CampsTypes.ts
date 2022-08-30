import { Role } from "./AuthTypes";

export enum CampStatus {
  DRAFT = "Draft",
  PAST = "Past",
  PUBLISHED = "Published",
}

export type Location = {
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  province: string;
  postalCode: string;
};

export type CampResponse = {
  id: string;
  active: boolean;
  ageLower: number;
  ageUpper: number;
  campCoordinators: string[];
  campCounsellors: string[];
  name: string;
  description: string;
  earlyDropoff: string;
  endTime: string;
  latePickup: string;
  location: Location;
  startTime: string;
  fee: number;
  formQuestions: FormQuestion[];
  campSessions: CampSession[];
  volunteers: string;
  campPhotoUrl: string;
};

export type QuestionType = "Text" | "MultipleChoice" | "Multiselect";

export type CampSession = {
  id: string;
  camp: string;
  capacity: number;
  campers: string[];
  waitlist: string[];
  dates: string[];
};

export type FormQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  options?: string[];
};
