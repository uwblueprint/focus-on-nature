import Stripe from "stripe";
import { Camp } from "../models/camp.model";
import { CampSession } from "../models/campSession.model";
import { CreateCampersDTO } from "../types";
import { getEDUnits, getLPUnits } from "./CampUtils";

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
  camp: Camp,
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  return sessionsToRegister.flatMap((campSession) => {
    const priceItems = [
      { price: campSession.campPriceId, quantity: campers.length },
    ];

    const [earlyDropoffs, latePickups] = campers.reduce(
      ([earlyTotal, lateTotal]: [number, number], camper) => [
        earlyTotal + getEDUnits(camper.earlyDropoff, camp),
        lateTotal + getLPUnits(camper.latePickup, camp),
      ],
      [0, 0],
    );

    if (earlyDropoffs) {
      priceItems.push({
        price: camp.dropoffPriceId,
        quantity: earlyDropoffs,
      });
    }

    if (latePickups) {
      priceItems.push({
        price: camp.pickupPriceId,
        quantity: latePickups,
      });
    }

    return priceItems;
  });
};

export async function createStripeCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  campId: string,
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  const checkoutSession: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.create(
    {
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/register/camp/${campId}?result=success`,
      cancel_url: `${process.env.CLIENT_URL}/register/camp/${campId}?result=cancel`,
      allow_promotion_codes: true,
    },
  );

  return checkoutSession;
}

export async function retrieveStripeCheckoutSession(chargeId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> { 
  return await stripe.checkout.sessions.retrieve(chargeId)
}
