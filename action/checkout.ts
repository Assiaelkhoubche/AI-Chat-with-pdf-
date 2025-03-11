"use server";

import { userDtails } from "@/types/type";
import { getUser } from "./user";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

const createCheckoutSession = async (userDtails: userDtails) => {
  const user = await getUser();
  if (!user) {
    throw new Error("user not authenticated");
  }

  let stripeCustomerId;

  try {
    await connectDB();
    const userInfo = await User.findOne({ _id: user.id }).select(
      "stripeCustomerId"
    );

    stripeCustomerId = userInfo?.stripeCustomerId;

    if (!userInfo?.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userDtails.email,
        name: userDtails.name,
        metadata: {
          userId: user.id,
        },
      });

      await User.updateOne({ _id: user.id }, { stripeCustomerId: customer.id });
      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1R0iV8Bsw6xsRNOjfJGs78Qk",
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      success_url: `${getBaseUrl()}/dashboard?updated=true`,
      cancel_url: `${getBaseUrl()}/dashboard/upgrade`,
    });

    return session.id;
  } catch (err) {
    throw new Error("Failed to connect to database");
  }
};

export default createCheckoutSession;
