// import { CampSession } from "./CampsTypes";

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
  //   campSession: CampSession;
  linkExpiry?: Date;
};
