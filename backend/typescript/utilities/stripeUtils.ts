import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

export interface IStripeCampProducts {
  campProductId: string;
  dropoffProductId: string;
  pickUpProductId: string;
}

export async function createStripeCampProducts({
  campName,
  campDescription,
}: {
  campName: string;
  campDescription: string;
}): Promise<IStripeCampProducts> {
  const campProduct = await stripe.products.create({
    name: campName,
    description: campDescription,
  });

  const dropoffProduct = await stripe.products.create({
    name: "Early drop off charges",
  });

  const pickUpProduct = await stripe.products.create({
    name: "Late pick up charges",
  });
  return {
    campProductId: campProduct.id,
    dropoffProductId: dropoffProduct.id,
    pickUpProductId: pickUpProduct.id,
  };
}

export async function updateStripeProduct({
  productId,
  campName,
  campDescription,
}: {
  productId: string;
  campName?: string;
  campDescription?: string;
}) {
  await stripe.products.update(productId, {
    ...(campDescription && { description: campDescription }),
    ...(campName && { name: campName }),
  });
}

export async function createStripePrice(product: string, unit_amount: number) {
  return await stripe.prices.create({
    product,
    currency: "cad",
    unit_amount,
  });
}
