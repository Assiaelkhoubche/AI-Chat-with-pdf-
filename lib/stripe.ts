import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;


if (!stripeSecretKey) {
  throw new Error("Stripe secret key not found");
}

const stripe = new Stripe(stripeSecretKey);

 export default stripe;
