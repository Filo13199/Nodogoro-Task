const endpointSecret = process.env.WH_SECRET;
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Order = require("../models/Order");
module.exports = async (request, response) => {
  let event = request.body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      {
        let paymentIntent = event.data.object;
        await Order.findOneAndUpdate({ paymentIntentId: paymentIntent.id }, { status: "paid" });
      }
      break;
    case 'payment_intent.payment_failed':
      {
        let paymentIntent = event.data.object;
        await Order.findOneAndUpdate({ paymentIntentId: paymentIntent.id }, { status: "paymentFailed" });
      }
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}