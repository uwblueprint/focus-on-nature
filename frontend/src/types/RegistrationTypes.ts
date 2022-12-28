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
  selectedSessionIds: Set<string>;
  checkoutUrl: string;
};
