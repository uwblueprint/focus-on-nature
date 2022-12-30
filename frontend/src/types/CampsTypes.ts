import { Camper, WaitlistedCamper } from "./CamperTypes";

export enum CampStatus {
  COMPLETED = "Completed",
  DRAFT = "Draft",
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
  location: Location;
  startTime: string;
  endTime: string;
  fee: number;
  earlyDropoff: string;
  latePickup: string;
  dropoffFee: number;
  pickupFee: number;
  formQuestions: FormQuestion[];
  campSessions: CampSession[];
  volunteers: string;
  campPhotoUrl: string;
};

export type CreateUpdateCampRequest = Omit<
  CampResponse,
  "id" | "formQuestions" | "campSessions" | "campPhotoUrl"
> & {
  campSessions: CreateCampSessionRequest[];
  formQuestions: CreateFormQuestionRequest[];
};

export type CreateUpdateCampResponse = Omit<
  CampResponse,
  "formQuestions" | "campSessions"
> & {
  campSessions: string[];
  formQuestions: string[];
};

export type CampSession = {
  id: string;
  camp: string;
  capacity: number;
  campers: Camper[];
  waitlist: WaitlistedCamper[];
  dates: string[];
};

export type CreateCampSession = {
  startDate: Date;
  endDate: Date;
  dates: Date[];
  selectedWeekDays: Map<string, boolean>;
};

export type CreateCampSessionRequest = Omit<
  CampSession,
  "id" | "camp" | "campers" | "waitlist"
>;

export type CampSessionResponse = CampSession & { campPriceId: string };

export type ManageCampSessionDetails = Omit<
  CampSession,
  "camp" | "campers" | "waitlist"
> & { registeredCampers: number };

// { id: string; capacity?: number; dates?: string[] }
export type UpdateCampSessionsRequest = Partial<
  Omit<CampSession, "camp" | "campers" | "waitlist">
> &
  Pick<CampSession, "id">;

export type QuestionType = "Text" | "MultipleChoice" | "Multiselect";

export type QuestionCategory =
  | "PersonalInfo"
  | "CampSpecific"
  | "EmergencyContact";

export type FormQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  options?: string[];
  category: QuestionCategory;
};

export type CreateFormQuestionRequest = Omit<FormQuestion, "id">;
