import { RegistrantExperienceCamper } from "./CamperTypes";
import { CampResponse } from "./CampsTypes";
import { WaiverInterface } from "./waiverRegistrationTypes";

export type CartItem = {
  name: string;
  campers: number;
  totalPrice: number;
  details?: string;
};

export type EdlpDetails = {
  timeSlot: string; // Selected EDLP time
  units: number; // The units (# of time slots) of the ed (index 0) and lp (index 1) for the selected day per camper
  cost: number;
};

export type EdlpChoice = {
  earlyDropoff: EdlpDetails;
  latePickup: EdlpDetails;
};

// Ordered array by session date
export type EdlpSelections = Array<{
  [key: string]: EdlpChoice;
}>;

// Used for caching data useful for restoring session on failure,
// or for passing data through checkout flow to display on success
export type CheckoutData = {
  campers: RegistrantExperienceCamper[];
  camp: CampResponse | undefined;
  waiverInterface: WaiverInterface;
  // Set doesn't work with JSON stringify: https://stackoverflow.com/questions/31190885/json-stringify-a-set
  selectedSessionIds: string[];
  checkoutUrl: string;
  requireEarlyDropOffLatePickup: boolean | null;
  edlpSelections: EdlpSelections;
  chargeId: string;
};
