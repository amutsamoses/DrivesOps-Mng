import { Context } from "hono";
import {
  fetchAllPaymentWithBookingAndUserService,
  getSinglePaymentWithBookingAndUserService,
  fetchAllPaymentsByIdBookingIdWithUserService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
} from "./payment.service";
import { stripe } from "../drizzle/db";

//list all payments with limit
export const listAllPaymentsController = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));

    const data = await fetchAllPaymentWithBookingAndUserService(limit);
    if (data == null || data.length == 0) {
      return c.text("Payments not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

//get a single payment by id
export const getSinglePaymentController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const payment = await getSinglePaymentWithBookingAndUserService(id);
  if (payment == undefined) {
    return c.text("Payment not found", 404);
  }
  return c.json(payment, 200);
};

// creating payment controller
const paymentController = createPaymentService();

export const createPaymentController = {
  async createCheckoutSession(c: Context) {
    try {
      const { bookingId, amount } = await c.req.json();
      console.log(
        `Checking if booking exists with bookingId and received: ${bookingId}, amount: ${amount}`
      );

      const session = await (
        await paymentController
      ).createCheckoutSession(bookingId, amount);

      return c.json({ sessionId: session.id, checkoutUrl: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session", error);
      return c.json(
        {
          success: false,
          error: "Failed to create checkout session",
        },
        500
      );
    }
  },

  // testing all the checkout sessions
  async testingCreatedCheckoutSession(c: Context) {
    try {
      // for testing purposes only we employ hard coded values
      const bookingId = 100;
      const amount = 10000;
      console.log(
        `Testing checkout sessions with bookingId: ${bookingId}, amount: ${amount}`
      );
      const session = await (
        await paymentController
      ).createCheckoutSession(bookingId, amount);

      // trying to update the data once successful
      (await paymentController).handleSuccessfulPayment(session.id);

      return c.json({
        succuess: true,
        sessionId: session.id,
        checkoutUrl: session.url,
      });
    } catch (error: any) {
      console.error("Error creating checkout session", error);
      return c.json(
        {
          success: false,
          error: "Failed to create checkout session",
        },
        500
      );
    }
  },

  // end the testing of checkout sessions
  async handleWebhook(c: Context) {
    const sig = c.req.header("stripe-signature");
    const rawBody = await c.req.raw.text();

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRETE_KEY as string
      );

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          console.log(`Payment was successful with session id: ${session.id}`);
          (await paymentController).handleSuccessfulPayment(session.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      return c.json({ received: true }, 200);
    } catch (error: any) {
      console.error("Error handling webhook", error);
      return c.json({ success: false, error: "Failed to handle webhook" }, 400);
    }
  },
};

// Update a specific payment by ID
export const updatePaymentController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const paymentData = await c.req.json();
  try {
    // Search for the payment
    const searchedPayment = await getSinglePaymentWithBookingAndUserService(id);
    if (searchedPayment == undefined) return c.text("Payment not found", 404);

    // Update the payment data
    const res = await updatePaymentService(id, paymentData);

    // Return a success message
    if (!res) return c.text("Payment not updated", 404);

    return c.json({ msg: "Payment updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Delete a specific payment by ID
export const deletePaymentController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    // Search for the payment
    const payment = await getSinglePaymentWithBookingAndUserService(id);
    if (payment == undefined) return c.text("Payment not found", 404);

    // Delete the payment
    const res = await deletePaymentService(id);
    if (!res) return c.text("Payment not deleted", 404);

    return c.json({ msg: "Payment deleted successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
