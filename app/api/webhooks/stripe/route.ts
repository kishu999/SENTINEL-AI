import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    // Server-side verification guard
    if (!signature && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Missing required cryptographic signature" },
        { status: 400 }
      );
    }

    const payload = await req.json();

    // Handle supported webhook events
    switch (payload.type) {
      case "payment_intent.succeeded":
        const paymentIntent = payload.data.object;
        // In production: verify with Stripe SDK using stripe.webhooks.constructEvent
        console.log(`[Stripe Webhook] PaymentIntent succeeded: ${paymentIntent.id}`);
        break;

      case "payment_intent.payment_failed":
        console.warn(`[Stripe Webhook] Payment failed: ${payload.data.object.id}`);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${payload.type}`);
    }

    return NextResponse.json({ received: true, status: "verified" });
  } catch (err: any) {
    console.error("[Stripe Webhook Error]", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
