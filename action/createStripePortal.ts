"use server";

import connectDB from "@/lib/db";
import { getUser } from "./user";
import { User } from "@/lib/models/User";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

const createStripePortal = async () => {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  await connectDB();
  const userInfo = await User.findOne({ _id: user.id });
  const stripeCustomerId = userInfo?.stripeCustomerId;
  if (!stripeCustomerId) {
    throw new Error("Stripe customer id not found");
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });
  return session.url;
};
export default createStripePortal;
