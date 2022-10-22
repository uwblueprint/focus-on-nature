export type Role = "Admin" | "CampCoordinator";

export type DropOffType = "EarlyDropOff" | "LatePickUp";

export type QuestionCategory =
  | "PersonalInfo"
  | "CampSpecific"
  | "EmergencyContact";

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
  category: QuestionCategory;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  options?: string[];
};

export type CampCoordinatorDTO = UserDTO & { campSessions: string[] };

export type CamperDTO = {
  id: string;
  campSession: string;
  firstName: string;
  lastName: string;
  age: number;
  allergies: string;
  earlyDropoff: string[];
  latePickup: string[];
  specialNeeds: string;
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationshipToCamper: string;
  }[];
  registrationDate: string;
  hasPaid: boolean;
  formResponses: Map<string, string>;
  chargeId: string;
  charges: {
    camp: number;
    earlyDropoff: number;
    latePickup: number;
  };
  optionalClauses: [
    {
      clause: string;
      agreed: boolean;
    },
  ];
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
  status: string;
  linkExpiry?: Date;
};

export type CreateUserDTO = Omit<UserDTO, "id">;

export type UpdateUserDTO = Omit<UserDTO, "id"> & { campSessions?: string[] };

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type CampSessionDTO = {
  id: string;
  camp: string;
  capacity: number;
  campers: CamperDTO[] | string[];
  campPriceId: string;
  dates: string[];
  waitlist: WaitlistedCamperDTO[] | string[];
};

export type CampDTO = {
  id: string;
  active: boolean;
  ageLower: number;
  ageUpper: number;
  campCoordinators: string[];
  campCounsellors: string[];
  campProductId: string;
  dropoffPriceId: string;
  dropoffProductId: string;
  dropoffFee: number;
  pickupFee: number;
  name: string;
  description: string;
  earlyDropoff: string;
  endTime: string;
  latePickup: string;
  location: {
    streetAddress1: string;
    streetAddress2?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  pickupPriceId: string;
  pickupProductId: string;
  startTime: string;
  fee: number;
  formQuestions: string[];
  campSessions: string[];
  fileName?: string;
  volunteers: string;
};

export type GetCampDTO = Omit<CampDTO, "campSessions" | "formQuestions"> & {
  formQuestions: FormQuestionDTO[];
  campSessions: CampSessionDTO[];
  campPhotoUrl?: string;
};

export type CreateCampDTO = Omit<
  CampDTO,
  | "id"
  | "formQuestions"
  | "campSessions"
  | "campProductId"
  | "dropoffPriceId"
  | "dropoffProductId"
  | "pickupPriceId"
  | "pickupProductId"
> & {
  filePath?: string;
  fileContentType?: string;
};

export type UpdateCampDTO = Omit<
  CampDTO,
  | "id"
  | "formQuestions"
  | "campSessions"
  | "campProductId"
  | "dropoffPriceId"
  | "dropoffProductId"
  | "pickupPriceId"
  | "pickupProductId"
> & {
  filePath?: string;
  fileContentType?: string;
};

export type CreateCampSessionsDTO = Array<
  Omit<CampSessionDTO, "id" | "camp" | "campers" | "waitlist" | "campPriceId">
>;

// export type CampSessionDTO = {
//   capacity: number;
//   dates: string[];
// };

export type UpdateCampSessionDTO = Omit<
  CampSessionDTO,
  "id" | "camp" | "campers" | "waitlist" | "campPriceId"
>;

export type UpdateCampSessionsDTO = Partial<
  Omit<CampSessionDTO, "camp" | "campers" | "waitlist" | "campPriceId">
> & { id: string };

export type CreateFormQuestionsDTO = Omit<FormQuestionDTO, "id">[];

export type UpdateFormQuestionDTO = Omit<FormQuestionDTO, "id">[];

export type CreateCampersDTO = Array<Omit<CamperDTO, "id">>;

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

export type FormTemplateDTO = {
  formQuestions: [FormQuestionDTO];
};

export type WaitlistedCamperStatus =
  | "NotRegistered"
  | "RegistrationFormSent"
  | "Registered";
