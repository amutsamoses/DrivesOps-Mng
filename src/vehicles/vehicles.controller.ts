import { Context } from "hono";
import {
  fetchAllVehiclesService,
  getVehicleByIdService,
  createVehicleWithSpecificationsService,
  updateVehicleService,
  deleteVehicleService,
} from "./vehicles.service";

export const listAllVehiclesController = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    const data = await fetchAllVehiclesService(limit);

    if (data == null || data.length == 0) {
      return c.text("Vehicles not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const getVehicleByIdController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const vehicle = await getVehicleByIdService(id);
  if (vehicle == undefined) {
    return c.text("Vehicle not found", 404);
  }
  return c.json(vehicle, 200);
};

export const createVehicleController = async (c: Context) => {
  try {
    const vehicleData = await c.req.json();
    console.log(vehicleData);

    const createdVehicle = await createVehicleWithSpecificationsService(
      vehicleData
    );

    if (!createdVehicle) {
      return c.text("Vehicle not created", 404);
    }
    return c.json(createdVehicle, 201);
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    return c.json({ error: error?.message }, 400);
  }
};

export const updateVehicleController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const vehicle = await c.req.json();
  try {
    const searchedVehicle = await getVehicleByIdService(id);
    if (searchedVehicle == undefined) return c.text("Vehicle not found", 404);

    const res = await updateVehicleService(id, vehicle);
    if (!res) return c.text("Vehicle not updated", 404);

    return c.json({ msg: "Vehicle updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteVehicleController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const vehicle = await getVehicleByIdService(id);
    if (vehicle == undefined) return c.text("Vehicle not found", 404);

    const res = await deleteVehicleService(id);
    if (!res) return c.text("Vehicle not deleted", 404);

    return c.json({ msg: "Vehicle deleted successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
