import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

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

export async function createStripeDropoffProduct(): Promise<
  Stripe.Response<Stripe.Product>
> {
  const dropoffProduct = await stripe.products.create({
    name: "Early drop off charges",
  });
  return dropoffProduct;
}

export async function createStripePickUpProduct(): Promise<
  Stripe.Response<Stripe.Product>
> {
  const pickUpProduct = await stripe.products.create({
    name: "Late pick up charges",
  });
  return pickUpProduct;
}

export async function updateStripeProduct({
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
