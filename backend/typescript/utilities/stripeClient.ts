import Stripe from "stripe"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
    apiVersion: "2020-08-27",
  });
  
const YOUR_DOMAIN = 'http://localhost:4242'; // temp

const StripeClient = {
  async createCheckoutSession(priceId: string, quantity: number): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId, 
          quantity: quantity, 
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
  }
}; 

export default StripeClient; 