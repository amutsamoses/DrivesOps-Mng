import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { BookingsTable, TSBooking, TIBooking } from "../drizzle/schema";

// service to fetch all the bookings with a limit
export const allBookingWithBranchAndVehicleService = async (
  limit?: number
): Promise<TSBooking[] | null> => {
  if (limit) {
    return await db.query.BookingsTable.findMany({
      limit: limit,
      with: {
        branch: {
          columns: {
            name: true,
          },
        },
        vehicle: {
          columns: {
            rentalRate: true,
          },
          with: {
            specifications: {
              columns: {
                model: true,
              },
            },
          },
        },
      },
    });
  }
  return await db.query.BookingsTable.findMany({
    with: {
      branch: {
        columns: {
          name: true,
        },
      },
      vehicle: {
        columns: {
          rentalRate: true,
        },
        with: {
          specifications: {
            columns: {
              model: true,
            },
          },
        },
      },
    },
  });
};

// service to fetch a single booking by id
export const getBookingByIdWithBranchAndVehicleService = async (
  id: number
): Promise<TSBooking | undefined> => {
  return await db.query.BookingsTable.findFirst({
    where: eq(BookingsTable.bookingId, id),
    with: {
      branch: {
        columns: {
          name: true,
        },
      },
      vehicle: {
        columns: {
          rentalRate: true,
        },
        with: {
          specifications: {
            columns: {
              model: true,
            },
          },
        },
      },
    },
  });
};

// Service to create a new booking
export const createBookingService = async (
  booking: TIBooking
): Promise<string> => {
  await db.insert(BookingsTable).values(booking);
  return "Booking created successfully";
};

// Service to update a booking by ID
export const updateBookingService = async (
  id: number,
  booking: Partial<TIBooking>
): Promise<string> => {
  try {
    const result = await db
      .update(BookingsTable)
      .set(booking)
      .where(eq(BookingsTable.bookingId, id))
      .returning();
    if (result.length === 0) {
      return "Booking not found";
    }
    return "Booking updated successfully";
  } catch (error: any) {
    console.error("Error updating Booking:", error);
    throw new Error("Failed to update booking entry");
  }
};

// Service to delete a booking by ID
export const deleteBookingService = async (id: number): Promise<string> => {
  try {
    const result = await db
      .delete(BookingsTable)
      .where(eq(BookingsTable.bookingId, id))
      .returning();
    if (result.length === 0) {
      return "Booking not found";
    }
    return "Booking deleted successfully";
  } catch (error: any) {
    console.error("Error deleting Booking:", error);
    throw new Error("Failed to delete booking entry");
  }
};
