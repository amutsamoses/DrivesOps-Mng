import { Context } from "hono";
import {
  fetchAllFleetManagementService,
  getFleetManagementByIdService,
  createFleetManagementService,
  updateFleetManagementService,
  deleteFleetManagementService,
} from "./FleetManagement.service";

export const listFleetManagementController = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    const data = await fetchAllFleetManagementService(limit);

    if (data == null || data.length == 0) {
      return c.text("Fleet management records not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const getFleetManagementByIdController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const fleet = await getFleetManagementByIdService(id);
  if (fleet == undefined) {
    return c.text("Fleet management record not found", 404);
  }
  return c.json(fleet, 200);
};

export const createFleetManagementController = async (c: Context) => {
  try {
    const fleet = await c.req.json();
    const createdFleet = await createFleetManagementService(fleet);

    if (!createdFleet) {
      return c.text("Fleet management record not created", 404);
    }
    return c.json(createdFleet, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateFleetManagementController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const fleet = await c.req.json();
  try {
    const searchedFleet = await getFleetManagementByIdService(id);
    if (searchedFleet == undefined)
      return c.text("Fleet management record not found", 404);

    const res = await updateFleetManagementService(id, fleet);
    if (!res) return c.text("Fleet management record not updated", 404);

    return c.json({ msg: "Fleet management record updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteFleetManagementController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const fleet = await getFleetManagementByIdService(id);
    if (fleet == undefined)
      return c.text("Fleet management record not found", 404);

    const res = await deleteFleetManagementService(id);
    if (!res) return c.text("Fleet management record not deleted", 404);

    return c.json({ msg: "Fleet management record deleted successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
