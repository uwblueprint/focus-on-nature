import Stripe from "stripe"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
    apiVersion: "2020-08-27",
  });
  
const YOUR_DOMAIN = 'http://localhost:4242'; // temp

// create a function that takes in price and quantity to create checkout session

// export const session = stripe.checkout.sessions.create({
//   line_items: [
//     {
//       // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//       price: 'price_1KhfmWJBIcYylc2BSzfUaFyC', // price_campID --> can create a new price in the stripe dashboard 
//       quantity: 2,
//     },
//   ],
//   mode: 'payment',
//   success_url: `${YOUR_DOMAIN}?success=true`,
//   cancel_url: `${YOUR_DOMAIN}?canceled=true`,
// });

const StripeClient = {
  async createCheckoutSession(productId: string, campQuantity: number): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const prices = await stripe.prices.list({
      product: productId, 
      active: true, 
    })
    
    return stripe.checkout.sessions.create({
      line_items: [
        {
          price: prices.data[0].id, // there should only be one active price 
          // price: 'price_1KpHakJBIcYylc2B2TCJcFuY',
          quantity: campQuantity, 
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
  }
}; 

export default StripeClient; 