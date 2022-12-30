import { CartItem } from "../types/RegistrationTypes";

// eslint-disable-next-line import/prefer-default-export
export const calculateTotalPrice = (cartItems: CartItem[]): number =>
  cartItems.reduce((prevTotal, curItem) => prevTotal + curItem.totalPrice, 0);
