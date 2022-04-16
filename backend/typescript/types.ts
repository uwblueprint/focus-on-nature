export type Role = "Admin" | "CampLeader";

export type DropOffType = "EarlyDropOff" | "LatePickUp";

export type QuestionType = "Text" | "MultipleChoice" | "Multiselect";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  active: boolean;
};

export type FormQuestionDTO = {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  options?: string[];
};

export type CampLeaderDTO = UserDTO & { campSessions: string[] };

export type CamperDTO = {
  id: string;
  campSession: string;
  firstName: string;
  lastName: string;
  age: number;
  allergies: string;
  hasCamera: boolean;
  hasLaptop: boolean;
  earlyDropoff: string;
  latePickup: string;
  specialNeeds: string;
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }[];
  registrationDate: Date;
  hasPaid: boolean;
  formResponses: Map<string, string>;
  chargeId: string;
  charges: {
    camp: number;
    earlyDropoff: number;
    latePickup: number;
  };
};

export type CamperCSVInfoDTO = Omit<
  CamperDTO,
  "id" | "campSession" | "charges" | "formResponses"
> & { formResponses: { [key: string]: string } };

export type WaitlistedCamperDTO = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  campSession: string;
};

export type CreateUserDTO = Omit<UserDTO, "id">;

export type UpdateUserDTO = Omit<UserDTO, "id"> & { campSessions?: string[] };

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type CampSessionDTO = {
  id: string;
  camp: string;
  campers: string[];
  waitlist: string[];
  dates: string[];
  startTime: string;
  endTime: string;
  active: boolean;
};

export type CampDTO = {
  id: string;
  ageLower: number;
  ageUpper: number;
  capacity: number;
  name: string;
  description: string;
  location: string;
  fee: number;
  formQuestions: string[];
  campSessions: string[];
};

export type GetCampDTO = Omit<CampDTO, "campSessions" | "formQuestions"> & {
  formQuestions: FormQuestionDTO[];
  campSessions: (Omit<
    CampSessionDTO,
    "id" | "camp" | "campers" | "waitlist"
  > & { registrations: number; waitlist: number })[];
};

export type CreateCampDTO = Omit<
  CampDTO,
  "id" | "formQuestions" | "campSessions"
> & {
  formQuestions: Omit<FormQuestionDTO, "id">[];
  campSessions: Omit<CampSessionDTO, "id" | "camp" | "campers" | "waitlist">[];
};

export type UpdateCampDTO = Omit<
  CampDTO,
  "id" | "formQuestions" | "campSessions"
>;

export type CreateCampSessionDTO = Omit<
  CampSessionDTO,
  "id" | "camp" | "campers" | "waitlist"
>;

export type UpdateCampSessionDTO = Omit<
  CampSessionDTO,
  "id" | "camp" | "campers" | "waitlist"
>;

export type CreateCamperDTO = Omit<CamperDTO, "id">;

export type CreateWaitlistedCamperDTO = Omit<WaitlistedCamperDTO, "id">;

export type UpdateCamperDTO = Omit<
  CamperDTO,
  "id" | "registrationDate" | "chargeId" | "charges"
>;

export type AuthDTO = Token & UserDTO;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type WaiverDTO = {
  clauses: {
    text: string;
    required: boolean;
  }[];
};
