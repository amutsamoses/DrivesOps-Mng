import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from "../validator";
import {
  listAllBookingWithBranchAndVehicleController,
  getBookingByIdWithBranchAndVehicleController,
  createBookingController,
  updateBookingController,
  deleteBookingController,
} from "./booking.controller";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const bookingsRouter = new Hono();

// GET all bookings - /api/booking
bookingsRouter.get(
  "/bookings-branch-vehicle",
  adminOrUserRoleAuth,
  listAllBookingWithBranchAndVehicleController
);

// GET a single booking by ID - /api/bookings/:id
bookingsRouter.get(
  "/bookings/:id",
  adminOrUserRoleAuth,
  getBookingByIdWithBranchAndVehicleController
);

// POST create a new booking - /api/bookings
bookingsRouter.post(
  "/bookings",
  zValidator("json", bookingSchema),
  adminOrUserRoleAuth,
  createBookingController
);

// bookingsRouter.post('/bookings', createBookingController);

// PUT update a booking by ID - /api/bookings/:id
bookingsRouter.put(
  "/bookings/:id",
  adminOrUserRoleAuth,
  updateBookingController
);

// DELETE a booking by ID - /api/bookings/:id
bookingsRouter.delete("/bookings/:id", adminRoleAuth, deleteBookingController);
