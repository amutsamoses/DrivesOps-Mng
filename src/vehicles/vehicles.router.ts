import { Hono } from "hono";
import {
  listAllVehiclesController,
  getVehicleByIdController,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController,
} from "./vehicles.controller";
import { vehicleSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const vehiclesRouter = new Hono().basePath("/api");

// GET all vehicles - /api/vehicles
vehiclesRouter.get("/vehicles", adminOrUserRoleAuth, listAllVehiclesController);

// // GET a single vehicle by ID - /api/vehicles/:id
// vehiclesRouter.get(
//   "/vehicles/:id",
//   zValidator("json", vehicleSchema),
//   getVehicleByIdController
// );

vehiclesRouter.get(
  "/vehicles/:id",
  adminOrUserRoleAuth,
  getVehicleByIdController
);

// POST create a new vehicle - /api/vehicles
vehiclesRouter.post("/vehicles", adminRoleAuth, createVehicleController);

// PUT update a vehicle by ID - /api/vehicles/:id
vehiclesRouter.put("/vehicles/:id", adminRoleAuth, updateVehicleController);

// DELETE a vehicle by ID - /api/vehicles/:id
vehiclesRouter.delete("/vehicles/:id", adminRoleAuth, deleteVehicleController);
