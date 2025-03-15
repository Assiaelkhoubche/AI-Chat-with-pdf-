import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import stripe from "@/lib/stripe";
import { UserFetched } from "@/types/type";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const headerList = await headers();
  const body = await req.text();

  const signature = headerList.get("stripe-signature");

  if (!signature) return new Response("Signature not found", { status: 400 });

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Stripe Webhook Secret not set");
    return new Response(" Stripe Webhook Secret not found", { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body, //payload
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Error: ", err);
    return new Response(`Invalid request ${err}`, { status: 400 });
  }

  const getUserDetails = async (
    customerId: string
  ): Promise<UserFetched | null> => {
    await connectDB();
    const userInfo = await User.findOne({ stripeCustomerId: customerId }).limit(
      1
    );
    if (!userInfo) {
      return null;
    }
    return userInfo;
  };

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice?.customer as string;
      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        return new Response("User not found", { status: 400 });
      }
      await User.updateOne(
        { stripeCustomerId: customerId },
        { hasAciveMembership: true }
      );

      break;
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription?.customer as string;
      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        return new Response("User not found", { status: 400 });
      }
      await User.updateOne(
        { stripeCustomerId: customerId },
        { hasAciveMembership: false }
      );
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  return NextResponse.json({ message: "Webhook received" });
}
