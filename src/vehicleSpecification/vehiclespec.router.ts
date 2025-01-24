import { Hono } from "hono";
import {
  listVehicleSpecificationsController,
  getVehicleSpecificationController,
  createVehicleSpecificationController,
  updateVehicleSpecificationController,
  deleteVehicleSpecificationController,
} from "./vehiclespec.controller";
import { vehicleSpecificationsSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const vehicleSpecificationsRouter = new Hono().basePath("/api");

// GET all vehicle specifications - /api/vehicle-specifications
vehicleSpecificationsRouter.get(
  "/vehicle-specifications",
  listVehicleSpecificationsController
);

// GET a single vehicle specification by ID - /api/vehicle-specifications/:id
vehicleSpecificationsRouter.get(
  "/vehicle-specifications/:id",
  getVehicleSpecificationController
);

// POST create a new vehicle specification - /api/vehicle-specifications
vehicleSpecificationsRouter.post(
  "/vehicle-specifications",
  zValidator("json", vehicleSpecificationsSchema),
  createVehicleSpecificationController
);

// PUT update a vehicle specification by ID - /api/vehicle-specifications/:id
vehicleSpecificationsRouter.put(
  "/vehicle-specifications/:id",
  updateVehicleSpecificationController
);

// DELETE a vehicle specification by ID - /api/vehicle-specifications/:id
vehicleSpecificationsRouter.delete(
  "/vehicle-specifications/:id",
  deleteVehicleSpecificationController
);
