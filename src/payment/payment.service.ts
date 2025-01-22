import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  PaymentsTable,
  TSPayment,
  TIPayment,
  BookingsTable,
} from "../drizzle/schema";
import { stripe } from "../drizzle/db";

//service to fetch all payments
export const fetchAllPaymentWithBookingAndUserService = async (
  limit?: number
): Promise<TSPayment[] | null> => {
  if (limit) {
    return await db.query.PaymentsTable.findMany({
      limit: limit,
      with: {
        booking: {
          columns: {
            bookingId: true,
          },
          with: {
            user: true,
          },
        },
      },
    });
  }
  return await db.query.PaymentsTable.findMany({
    with: {
      booking: {
        columns: {
          bookingId: true,
        },
        with: {
          user: true,
        },
      },
    },
  });
};

//service to fetch a single payment by id
export const getSinglePaymentWithBookingAndUserService = async (
  id: number
): Promise<TSPayment | undefined> => {
  return await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.paymentId, id),
    with: {
      booking: {
        columns: {
          bookingId: true,
        },
        with: {
          user: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });
};

//service to fetch all payments by booking id
export const fetchAllPaymentsByIdBookingIdWithUserService = async (
  bookingId: number
): Promise<TSPayment[] | null> => {
  return await db.query.PaymentsTable.findMany({
    where: eq(PaymentsTable.bookingId, bookingId),
    with: {
      booking: {
        columns: {
          bookingId: true,
        },
        with: {
          user: true,
        },
      },
    },
  });
};

//definig some interface for creating payment service
// return a json response with message and client_secret
interface TPaymentResponse {
  message: string;
  client_secret: string | null;
}

//interface for initiating payment
interface TIPaymentService {
  bookingId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
}

//interface for getting the session url
interface TSessionUrl {
  sessionUrl: string;
}

//service to initiate payment
export const createPaymentService = async () => {
  return {
    async createCheckoutSession(bookingId: number, amount: number) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "car booking",
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/booking-success`,
        cancel_url: `${process.env.FRONTEND_URL}/booking-failed`,
        metadata: {
          bookingId: bookingId.toString(),
        },
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "usd",
        metadata: { booking_id: bookingId.toString() },
      });
      console.log("Frontend URL: ", process.env.FRONTEND_URL);
      console.log("Session URL: ", session.url);
      // update booking status
      await db
        .update(BookingsTable)
        .set({ bookingStatus: "confirmed" })
        .where(eq(BookingsTable.bookingId, bookingId));

      // insert payment records in the database
      await db
        .insert(PaymentsTable)
        .values({
          bookingId,
          paymentDate: new Date() as unknown as string,
          amount: amount as unknown as string,
          paymentStatus: "confirmed",
          paymentMethod: "credit_card",
          transactionId: paymentIntent.id,
        })
        .execute();
      return session;
    },
    async handleSuccessfulPayment(sessionId: string) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const bookingId = parseInt(session.metadata!.bookingId);

      //handle possible null value for session.amount_total
      const amountTotal = session.amount_total;
      if (amountTotal === null) {
        throw new Error("Session amount_total is null");
      }

      // update booking status
      await db
        .update(BookingsTable)
        .set({ bookingStatus: "confirmed" })
        .where(eq(BookingsTable.bookingId, bookingId));

      // insert payment records in the database
      await db
        .insert(PaymentsTable)
        .values({
          bookingId,
          amount: amountTotal as unknown as string,
          paymentDate: new Date() as unknown as string,
          paymentStatus: "confirmed",
          paymentMethod: session.payment_method_types[0],
          transactionId: session.payment_intent as string,
        })
        .returning();
    },
  };
};

// Service to update a payment by ID
export const updatePaymentService = async (
  id: number,
  payment: any
): Promise<string> => {
  await db
    .update(PaymentsTable)
    .set(payment)
    .where(eq(PaymentsTable.paymentId, id));
  return "Payment updated successfully";
};

// Service to delete a payment by ID
export const deletePaymentService = async (id: number): Promise<string> => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.paymentId, id));
  return "Payment deleted successfully";
};
