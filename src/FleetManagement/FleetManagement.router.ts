import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { fleetManagementSchema } from "../validator";
import {
  listFleetManagementController,
  getFleetManagementByIdController,
  createFleetManagementController,
  updateFleetManagementController,
  deleteFleetManagementController,
} from "./FleetManagement.controller";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const fleetManagementRouter = new Hono().basePath("/api");

// GET all fleet management records - /api/fleet-management
fleetManagementRouter.get(
  "/fleet-management",
  adminOrUserRoleAuth,
  listFleetManagementController
);

// GET a single fleet management record by ID - /api/fleet-management/:id
fleetManagementRouter.get(
  "/fleet-management/:id",
  adminRoleAuth,
  getFleetManagementByIdController
);

// POST a new fleet management record - /api/fleet-management
fleetManagementRouter.post(
  "/fleet-management",
  zValidator("json", fleetManagementSchema),

  adminRoleAuth,

  createFleetManagementController
);

// PUT a fleet management record by ID - /api/fleet-management/:id
fleetManagementRouter.put(
  "/fleet-management/:id",
  adminRoleAuth,
  updateFleetManagementController
);

// DELETE a fleet management record by ID - /api/fleet-management/:id
fleetManagementRouter.delete(
  "/fleet-management/:id",
  adminRoleAuth,
  deleteFleetManagementController
);
