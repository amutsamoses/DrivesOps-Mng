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
  "/api/bookings-branch-vehicle",
  adminOrUserRoleAuth,
  listAllBookingWithBranchAndVehicleController
);

// GET a single booking by ID - /api/bookings/:id
bookingsRouter.get(
  "/api/bookings/:id",
  adminOrUserRoleAuth,
  getBookingByIdWithBranchAndVehicleController
);

// POST create a new booking - /api/bookings
bookingsRouter.post(
  "/api/bookings",
  zValidator("json", bookingSchema),
  adminOrUserRoleAuth,
  createBookingController
);

// bookingsRouter.post('/bookings', createBookingController);

// PUT update a booking by ID - /api/bookings/:id
bookingsRouter.put(
  "/api/bookings/:id",
  adminOrUserRoleAuth,
  updateBookingController
);

// DELETE a booking by ID - /api/bookings/:id
bookingsRouter.delete("/api/bookings/:id", adminRoleAuth, deleteBookingController);
