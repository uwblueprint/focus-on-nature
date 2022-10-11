export type EmergencyContact = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  relationshipToCamper: string;
};

export type Camper = {
  id: string;
  // campSession: CampSession;
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
  chargeId: string;
  charges: {
    camp: number;
    earlyDropoff: number;
    latePickup: number;
  };
  optionalClauses?: [
    {
      clause: string;
      agreed: boolean;
    },
  ];
};

export type EditCamperInfoFields = Omit<
  Camper,
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
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  status: WaitlistedCamperStatus;
  campSession: string;
  linkExpiry?: Date;
};
