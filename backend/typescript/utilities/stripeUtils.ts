import Stripe from "stripe";

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

export async function createStripeCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
): Promise<string | null> {
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/register/success`,
    cancel_url: `${process.env.CLIENT_URL}/register/cancel`,
  });

  return checkoutSession.url;
}
