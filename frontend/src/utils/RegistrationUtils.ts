import { CAMP_ID_SESSION_STORAGE_KEY } from "../constants/RegistrationConstants";
import { RegistrantExperienceCamper } from "../types/CamperTypes";
import { CampResponse } from "../types/CampsTypes";
import { CartItem, CheckoutData } from "../types/RegistrationTypes";

export const getCheckoutSessionStorageKey = (campId: string): string =>
  `checkout-${campId}`;

export const mapCampToCartItems = (
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

// `formResponses` is a Map, which does not stringify easily
// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
type JSONRegistrantExperienceCamper = Omit<
  RegistrantExperienceCamper,
  "formResponses"
> & {
  formResponses?: [string, string][];
};

export const saveRegistrationSessionToSessionStorage = (
  sessionCampId: string, // better named `campId`, but linter doesn't like
  checkoutData: CheckoutData,
): void => {
  const parseData: Omit<CheckoutData, "campers"> & {
    campers: Array<JSONRegistrantExperienceCamper>;
  } = {
    ...checkoutData,
    campers: checkoutData.campers.map((camper) => {
      return {
        ...camper,
        formResponses: camper.formResponses
          ? Array.from(camper.formResponses.entries())
          : undefined,
      };
    }),
  };

  sessionStorage.setItem(CAMP_ID_SESSION_STORAGE_KEY, sessionCampId);
  sessionStorage.setItem(
    getCheckoutSessionStorageKey(sessionCampId),
    JSON.stringify(parseData),
  );
};

export const restoreRegistrationSessionFromSessionStorage = ():
  | CheckoutData
  | undefined => {
  try {
    let restoredSession: CheckoutData | undefined;
    const checkoutCampId = sessionStorage.getItem(CAMP_ID_SESSION_STORAGE_KEY);

    if (checkoutCampId) {
      const checkoutKey = getCheckoutSessionStorageKey(checkoutCampId);
      const sessionData = sessionStorage.getItem(checkoutKey);

      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        restoredSession = {
          ...parsedSession,
          campers: parsedSession.campers.map(
            (camper: JSONRegistrantExperienceCamper) => {
              return {
                ...camper,
                formResponses: camper.formResponses
                  ? new Map(camper.formResponses)
                  : undefined,
              };
            },
          ),
        };
      }
      sessionStorage.clear();
    }

    return restoredSession;
  } catch (err: unknown) {
    return undefined;
  }
};
