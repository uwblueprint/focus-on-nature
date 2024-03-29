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

export type CreateFormQuestionDTO = Omit<FormQuestionDTO, "id">;

export type CampCoordinatorDTO = UserDTO & { campSessions: string[] };

export type CamperCharges = {
  camp: number; // Total fees of attending the session of camp (ie: daily camp fee * days in session)
  earlyDropoff: number; // Total fees of ED in session (ie: EDLP fee * total hours of ED selected in session)
  latePickup: number; // Total fees of LP in session (ie: EDLP fee * total hours of LP selected in session)
};

export type CampRegistrationDTO = {
  campers: CamperDTO[];
  checkoutSessionUrl: string;
};

export type CamperDTO = {
  id: string;
  campSession: string;
  firstName: string;
  lastName: string;
  age: number;
  allergies?: string;
  earlyDropoff: string[];
  latePickup: string[];
  specialNeeds?: string;
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationshipToCamper: string;
  }[];
  registrationDate: string;
  hasPaid: boolean;
  refundStatus: string;
  formResponses: Map<string, string>;
  chargeId: string;
  charges: CamperCharges;
  refundCode: string;
  optionalClauses: [
    {
      clause: string;
      agreed: boolean;
    },
  ];
};

export type CamperCSVInfoDTO = {
  "Registration Date": string;
  "Camper Name": string;
  "Camper Age": number;
  "Primary Emergency Contact Name": string;
  "Primary Emergency Contact Phone #": string;
  "Primary Emergency Contact Email": string;
  "Secondary Emergency Contact Name": string;
  "Secondary Emergency Contact Phone #": string;
  "Requires Early Drop-off": string;
  "Requires Late Pick-up": string;
  // eslint-disable-next-line
  Allergies: string;
  "Amount Paid": number;
  "Additional Accomodations": string;
  "Additional Camp-Specific Q's": string;
  "Additional Waiver Clauses": string;
};

export type WaitlistedCamperStatus =
  | "NotRegistered"
  | "RegistrationFormSent"
  | "Registered";

export type WaitlistedCamperDTO = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactNumber: string;
  campSession: string;
  status: WaitlistedCamperStatus;
  linkExpiry?: Date;
  registrationDate: string;
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

export type CampLocation = {
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  province: string;
  postalCode: string;
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
  location: CampLocation;
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

export type CreateUpdateCampDTO = Omit<
  CampDTO,
  | "id"
  | "formQuestions"
  | "campSessions"
  | "campProductId"
  | "dropoffPriceId"
  | "dropoffProductId"
  | "pickupPriceId"
  | "pickupProductId"
  | "earlyDropoff"
  | "latePickup"
  | "pickupFee"
  | "dropoffFee"
> & {
  filePath?: string;
  fileContentType?: string;
  formQuestions: CreateFormQuestionDTO[];
  campSessions: CreateCampSessionsDTO;
  earlyDropoff?: string;
  latePickup?: string;
  pickupFee?: number;
  dropoffFee?: number;
};

export type CreateCampSessionsDTO = Array<
  Omit<CampSessionDTO, "id" | "camp" | "campers" | "waitlist" | "campPriceId">
>;

// Exposes "dates: string[]" and "capacity: number"
export type UpdateCampSessionDTO = Partial<
  Omit<CampSessionDTO, "id" | "camp" | "campers" | "waitlist" | "campPriceId">
>;

export type UpdateCampSessionsDTO = Partial<
  Omit<CampSessionDTO, "camp" | "campers" | "waitlist" | "campPriceId">
> & { id: string };

export type UpdateFormQuestionDTO = Omit<FormQuestionDTO, "id">[];

export type CreateCampersDTO = Array<
  Omit<
    CamperDTO,
    | "id"
    | "campSession"
    | "charges"
    | "hasPaid"
    | "chargeId"
    | "refundCode"
    | "registrationDate"
  >
>;

export type CreateWaitlistedCamperDTO = Omit<
  WaitlistedCamperDTO,
  "id" | "campSession" | "status" | "linkExpiry" | "registrationDate"
>;

export type UpdateCamperDTO = Omit<
  CamperDTO,
  | "id"
  | "registrationDate"
  | "chargeId"
  | "charges"
  | "refundCode"
  | "earlyDropoff"
  | "latePickup"
  | "contacts"
  | "optionalClauses"
  | "refundStatus"
>;

export type RefundDTO = Array<RefundCamperGroupDTO>;

export type RefundCamperGroupDTO = {
  firstName: string;
  lastName: string;
  age: number;
  campName: string;
  campPhotoUrl?: string;
  startTime: string;
  endTime: string;
  instances: Array<RefundCamperDTO>;
};

export type RefundCamperDTO = CamperDTO & { dates: string[] };

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
  formQuestions: FormQuestionDTO[];
};
