import Stripe from "stripe";
import { CampSession } from "../models/campSession.model";
import { CreateCampersDTO } from "../types";

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

const dropoffProductName = "Early Drop Off Fees";
const pickupProductName = "Late Pick Up Fees";

export async function createStripeCampProduct({
  campName,
  campDescription,
}: {
  campName: string;
  campDescription: string;
}): Promise<Stripe.Response<Stripe.Product>> {
  const campProduct = await stripe.products.create({
    name: campName,
    description: campDescription,
  });
  return campProduct;
}

export async function createStripeDropoffProduct(
  campName: string,
): Promise<Stripe.Response<Stripe.Product>> {
  const dropoffProduct = await stripe.products.create({
    name: `${campName} - ${dropoffProductName}`,
  });
  return dropoffProduct;
}

export async function createStripePickupProduct(
  campName: string,
): Promise<Stripe.Response<Stripe.Product>> {
  const pickupProduct = await stripe.products.create({
    name: `${campName} - ${pickupProductName}`,
  });
  return pickupProduct;
}

export async function updateStripeCampProduct({
  productId,
  campName,
  campDescription,
}: {
  productId: string;
  campName?: string;
  campDescription?: string;
}): Promise<void> {
  await stripe.products.update(productId, {
    ...(campDescription && { description: campDescription }),
    ...(campName && { name: campName }),
  });
}

export async function updateStripeDropoffProduct({
  productId,
  campName,
}: {
  productId: string;
  campName?: string;
}): Promise<void> {
  await stripe.products.update(productId, {
    ...(campName && { name: `${campName} - ${dropoffProductName}` }),
  });
}

export async function updateStripePickupProduct({
  productId,
  campName,
}: {
  productId: string;
  campName?: string;
}): Promise<void> {
  await stripe.products.update(productId, {
    ...(campName && { name: `${campName} - ${pickupProductName}` }),
  });
}

export async function createStripePrice(
  product: string,
  unit_amount: number,
): Promise<Stripe.Response<Stripe.Price>> {
  const priceObject = await stripe.prices.create({
    product,
    currency: "cad",
    unit_amount,
  });
  return priceObject;
}

export const createStripeLineItems = (
  sessionsToRegister: CampSession[],
  campers: CreateCampersDTO,
  dropoffPriceId: string,
  pickupPriceId: string,
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  return sessionsToRegister.flatMap((campSession) => {
    const priceItems = [
      { price: campSession.campPriceId, quantity: campers.length },
    ];

    // every camper belongs to every session
    // all same EDLP price
    // campers have different EDLP dates, which may belong to different sessions
    // we want to isolate EDLP per session

    // Assumes that campers are only registered for one session per day
    const [earlyDropoffs, latePickups] = campers.reduce(
      ([earlyTotal, lateTotal]: [number, number], camper) => {
        let camperEarlyTotal = 0;
        if (camper.earlyDropoff) {
          const camperEDDates = new Set(camper.earlyDropoff);
          const edDates = campSession.dates.filter((date) =>
            camperEDDates.has(date.toString()),
          );

          camperEarlyTotal += edDates.length;
        }

        let camperLateTotal = 0;
        if (camper.latePickup) {
          const camperLPDates = new Set(camper.latePickup);
          const lpDates = campSession.dates.filter((date) =>
            camperLPDates.has(date.toString()),
          );
          camperLateTotal += lpDates.length;
        }

        return [earlyTotal + camperEarlyTotal, lateTotal + camperLateTotal];
      },
      [0, 0],
    );

    if (earlyDropoffs) {
      priceItems.push({
        price: dropoffPriceId,
        quantity: earlyDropoffs,
      });
    }

    if (latePickups) {
      priceItems.push({
        price: pickupPriceId,
        quantity: latePickups,
      });
    }

    return priceItems;
  });
};

export async function createStripeCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  campId: string,
): Promise<string | null> {
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/register/camp/${campId}?result=success`,
    cancel_url: `${process.env.CLIENT_URL}/register/camp/${campId}?result=cancel`,
  });

  return checkoutSession.url;
}
