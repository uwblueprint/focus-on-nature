export type Camper = {
  id: string;
  // campSession: CampSession;
  campSession: string;
  firstName: string;
  lastName: string;
  age: number;
  allergies?: string;
  earlyDropoff?: Date[];
  latePickup?: Date[];
  specialNeeds?: string;
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationshipToCamper: string;
  }[];
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
