import { Role } from "./AuthTypes";

export type Camp = {
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
  location: string;
  startTime: string;
  fee: number;
  formQuestions: FormQuestion[];
  campSessions: CampSession[];
  fileName?: string;
  volunteers: string[];
};

export type EditCampDataType = {
  campCoordinators?: CampCoordinator[];
  campCounsellors?: CampCoordinator[];
  volunteers?: string[];
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

export type User = {
  value: string;
  label: string;
};

export type CampCoordinator = {
  firstName: string;
  lastName: string;
  authId: string;
  email: string;
  role: Role;
  active: boolean;
  campSessions: CampSession[];
}