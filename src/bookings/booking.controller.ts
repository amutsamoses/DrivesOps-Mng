import { Context } from "hono";
import {
  allBookingWithBranchAndVehicleService,
  getBookingByIdWithBranchAndVehicleService,
  createBookingService,
  updateBookingService,
  deleteBookingService,
} from "./booking.service";

export const listAllBookingWithBranchAndVehicleController = async (
  c: Context
) => {
  try {
    const limit = Number(c.req.query("limit"));
    const data = await allBookingWithBranchAndVehicleService(limit);

    if (data == null || data.length == 0) {
      return c.text("Bookings not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const getBookingByIdWithBranchAndVehicleController = async (
  c: Context
) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const booking = await getBookingByIdWithBranchAndVehicleService(id);
  if (booking == undefined) {
    return c.text("Booking not found", 404);
  }
  return c.json(booking, 200);
};

export const createBookingController = async (c: Context) => {
  try {
    const booking = await c.req.json();
    const createdBooking = await createBookingService(booking);

    if (!createdBooking) {
      return c.text("Booking not created", 404);
    }
    return c.json(createdBooking, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateBookingController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const booking = await c.req.json();
  try {
    const searchedBooking = await getBookingByIdWithBranchAndVehicleService(id);
    if (searchedBooking == undefined) return c.text("Booking not found", 404);

    const res = await updateBookingService(id, booking);
    if (!res) return c.text("Booking not updated", 404);

    return c.json({ msg: "Booking updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteBookingController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const booking = await getBookingByIdWithBranchAndVehicleService(id);
    if (booking == undefined) return c.text("Booking not found", 404);

    const res = await deleteBookingService(id);
    if (!res) return c.text("Booking not deleted", 404);

    return c.json({ msg: "Booking deleted successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
