import { Waiver } from "./AdminTypes";
import { RegistrantExperienceCamper } from "./CamperTypes";
import { CampResponse } from "./CampsTypes";

export type CartItem = {
  name: string;
  campers: number;
  totalPrice: number;
  details?: string;
};

// Used for caching data useful for restoring session on failure,
// or for passing data through checkout flow to display on success
export type CheckoutData = {
  campers: RegistrantExperienceCamper[];
  camp: CampResponse | undefined;
  items: CartItem[];
  waiver: Waiver;
  // Set doesn't work with JSON stringify: https://stackoverflow.com/questions/31190885/json-stringify-a-set
  selectedSessionIds: string[];
  checkoutUrl: string;
  requireEarlyDropOffLatePickup: boolean | null;
  chargeId: string;
};

export enum RegistrationErrors {
  EmailRecipientsUndefined = "No recipients defined",
}

export enum RegistrationErrorMessages {
  Email = "Email validation failed. Please check email and try again.",
}
