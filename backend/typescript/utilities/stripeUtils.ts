import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

export interface IStripeCampProducts {
  productId: string;
  dropoffProductId: string;
  pickUpProductId: string;
}

export async function createStripeCampProducts(
  campName: string,
  campDescription: string,
): Promise<IStripeCampProducts> {
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
    productId: campProduct.id,
    dropoffProductId: dropoffProduct.id,
    pickUpProductId: pickUpProduct.id,
  };
}
