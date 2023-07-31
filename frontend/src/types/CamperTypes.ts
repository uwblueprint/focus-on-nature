export type EmergencyContact = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  relationshipToCamper: string;
};

export type OptionalClause = {
  clause: string;
  agreed: boolean;
};

export type Camper = {
  id: string;
  campSession: string;
  firstName: string;
  lastName: string;
  age: number;
  allergies?: string;
  earlyDropoff?: Date[];
  latePickup?: Date[];
  specialNeeds?: string;
  contacts: EmergencyContact[];
  formResponses?: Map<string, string>;
  registrationDate: Date;
  hasPaid: boolean;
  refundStatus: string;
  chargeId: string;
  charges: {
    camp: number;
    earlyDropoff: number;
    latePickup: number;
  };
  optionalClauses?: OptionalClause[];
};

export type RegistrantExperienceCamper = Omit<
  Camper,
  "campSession" | "id" | "charges" | "hasPaid" | "chargeId" | "registrationDate"
>;

// Fields are required by backend
export type CreateCamperDTO = Omit<
  RegistrantExperienceCamper,
  "earlyDropoff" | "latePickup" | "optionalClauses" | "formResponses"
> & {
  formResponses?: { [key: string]: string };
  earlyDropoff: string[];
  latePickup: string[];
  optionalClauses: OptionalClause[];
};

export type EditCamperInfoFields = Omit<
  Partial<Camper>,
  | "earlyDropoff"
  | "latePickup"
  | "registrationDate"
  | "contacts"
  | "chargeId"
  | "charges"
  | "optionalClauses"
  | "id"
>;

export type EditModalSetterFunctions = {
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setAge: (age: number) => void;
  setAllergies: (allergies: string | undefined) => void;
  setSpecialNeeds: (sn: string | undefined) => void;
  setFormResponses: (formResponses: Map<string, string> | undefined) => void;
};

export type UpdateWaitlistedStatusType = {
  status: WaitlistedCamperStatus;
};

export type WaitlistedCamperStatus =
  | "NotRegistered"
  | "RegistrationFormSent"
  | "Registered";

export type WaitlistedCamper = {
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
  registrationDate: Date;
};

export type CreateWaitlistedCamperDTO = Omit<
  WaitlistedCamper,
  "id" | "campSession" | "status" | "linkExpiry" | "registrationDate"
>;

export type CreateCamperResponse = {
  campers: Camper[];
  checkoutSessionUrl: string;
};

export type RefundDTO = {
  firstName: string;
  lastName: string;
  age: number;
  campName: string;
  campPhotoUrl?: string;
  instances: Array<CamperRefundDTO>;
  startTime: string;
  endTime: string;
};

export type CamperRefundDTO = Omit<
  Camper,
  | "firstName"
  | "lastName"
  | "age"
  | "contacts"
  | "formResponses"
  | "optionalClauses"
> & {
  dates: string[];
};
