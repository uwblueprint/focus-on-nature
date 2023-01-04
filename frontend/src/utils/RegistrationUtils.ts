import {
  CAMP_ID_SESSION_STORAGE_KEY,
  EDLP_PLACEHOLDER_TIMESLOT,
} from "../constants/RegistrationConstants";
import { RegistrantExperienceCamper } from "../types/CamperTypes";
import { CampResponse, CampSession } from "../types/CampsTypes";
import { CartItem, CheckoutData, EdlpChoice } from "../types/RegistrationTypes";

export const getCheckoutSessionStorageKey = (campId: string): string =>
  `checkout-${campId}`;

export const mapCampToCartItems = (
  camp: CampResponse,
  sessions: CampSession[],
  campers: RegistrantExperienceCamper[],
  edlpChoices: EdlpChoice[][],
): CartItem[] => {
  return sessions
    .sort(
      (sessionA, sessionB) =>
        // Assumes all sessions have at least one date
        new Date(sessionA.dates[0]).getTime() -
        new Date(sessionB.dates[0]).getTime(),
    )
    .flatMap((campSession, sessionIndex) => {
      const sessionDisplayIndex = sessionIndex + 1;
      const cartItems: CartItem[] = [
        {
          name: `Session ${sessionDisplayIndex}`,
          campers: campers.length,
          totalPrice: campers.length * campSession.dates.length * camp.fee,
        },
      ];

      if (
        edlpChoices[sessionIndex].some(
          (edlpChoice) =>
            edlpChoice.earlyDropoff.timeSlot !== EDLP_PLACEHOLDER_TIMESLOT,
        )
      ) {
        const [cost, units] = edlpChoices[sessionIndex].reduce(
          ([costSum, unitsSum], edlpDay) => {
            return [
              costSum + edlpDay.earlyDropoff.cost * campers.length,
              unitsSum + edlpDay.earlyDropoff.units * campers.length,
            ];
          },
          [0, 0],
        );

        cartItems.push({
          name: `Session ${sessionDisplayIndex} - Early Dropoff`,
          campers: campers.length,
          totalPrice: cost,
          details: `${units * 30} mintues`,
        });
      }

      if (
        edlpChoices[sessionIndex].some(
          (edlpChoice) =>
            edlpChoice.latePickup.timeSlot !== EDLP_PLACEHOLDER_TIMESLOT,
        )
      ) {
        const [cost, units] = edlpChoices[sessionIndex].reduce(
          ([costSum, unitsSum], edlpDay) => {
            return [
              costSum + edlpDay.latePickup.cost * campers.length,
              unitsSum + edlpDay.latePickup.units * campers.length,
            ];
          },
          [0, 0],
        );

        cartItems.push({
          name: `Session ${sessionDisplayIndex} - Late Pickup`,
          campers: campers.length,
          totalPrice: cost,
          details: `${units * 30} mintues`,
        });
      }
      return cartItems;
    });
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
