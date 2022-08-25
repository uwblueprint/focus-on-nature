import { CampSession } from "./CampsTypes";

export type Camper = {
  // id: string;
  // campSession: CampSession;
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
  // formResponses?: Map<string, string>;
  // registrationDate: Date;
  // hasPaid: boolean;
  // chargeId: string;
  // charges: {
  //   camp: number;
  //   earlyDropoff: number;
  //   latePickup: number;
  // };
  // optionalClauses?: [
  //   {
  //     clause: string;
  //     agreed: boolean;
  //   },
  // ];
};
