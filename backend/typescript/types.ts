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

export type CampLeaderDTO = UserDTO & { camps: string[] };

export type CamperDTO = {
  id: string;
  campSession: string;
  registrationDate: Date;
  hasPaid: boolean;
  chargeId: number;
  formResponses: {
    [key: string]: string;
  };
};

export type CamperCSVInfoDTO = Omit<CamperDTO, "campSession" | "id">;

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

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type CampDTO = {
  id: string;
  ageLower: number;
  ageUpper: number;
  name: string;
  description: string;
  location: string;
  fee: number;
  formQuestions: Omit<FormQuestionDTO, "id">[];
  campSessions: string[];
};

export type CampSessionDTO = {
  id: string;
  camp: string;
  campers: string[];
  capacity: number;
  waitlist: string[];
  dates: string[];
  startTime: string;
  endTime: string;
  active: boolean;
};

export type CreateCampDTO = Omit<
  CampDTO & CampSessionDTO,
  "id" | "camp" | "campers" | "waitlist" | "campSessions"
>;
export type CreateCamperDTO = Omit<CamperDTO, "id">;

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
