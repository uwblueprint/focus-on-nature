import { Waiver } from "./AdminTypes";
import { CreateCamperRequest } from "./CamperTypes";
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
  campers: CreateCamperRequest[];
  camp: CampResponse | undefined;
  items: CartItem[];
  waiver: Waiver;
  checkoutUrl: string;
};
