import { CreateCamperRequest } from "../types/CamperTypes";
import { CampResponse } from "../types/CampsTypes";
import { CartItem } from "../types/RegistrationTypes";

export const getCheckoutSessionStorageKey = (campId: string): string =>
  `checkout-${campId}`;

export const getFailedSessionStorageKey = (campId: string): string =>
  `failedCheckout-${campId}`;

export const mapToCampItems = (
  campers: CreateCamperRequest[],
  camp: CampResponse,
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
