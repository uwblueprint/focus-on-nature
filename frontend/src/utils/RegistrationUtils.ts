import { CAMP_ID_SESSION_STORAGE_KEY } from "../constants/RegistrationConstants";
import { RegistrantExperienceCamper } from "../types/CamperTypes";
import { CampResponse } from "../types/CampsTypes";
import { CartItem, CheckoutData } from "../types/RegistrationTypes";

export const getCheckoutSessionStorageKey = (campId: string): string =>
  `checkout-${campId}`;

export const mapToCampItems = (
  camp: CampResponse,
  campers: RegistrantExperienceCamper[],
): CartItem[] => {
  const items: CartItem[] = [
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
      details: "Some sample details",
    },
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
    },
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
    },
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
    },
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
    },
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
    },
    {
      name: "yes",
      campers: 2,
      totalPrice: 15.5,
    },
  ];

  return items;
};

export const calculateTotalPrice = (cartItems: CartItem[]): number =>
  cartItems.reduce((prevTotal, curItem) => prevTotal + curItem.totalPrice, 0);

export const saveCheckoutSessionToSessionStorage = (
  sessionCampId: string, // better named `campId`, but linter doesn't like
  checkoutData: CheckoutData,
) => {
  sessionStorage.setItem(CAMP_ID_SESSION_STORAGE_KEY, sessionCampId);
  sessionStorage.setItem(
    getCheckoutSessionStorageKey(sessionCampId),
    JSON.stringify(checkoutData),
  );
};
