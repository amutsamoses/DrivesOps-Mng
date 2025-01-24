import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import {
  FleetManagementTable,
  TIFleetManagement,
  TSFleetManagement,
} from "../drizzle/schema";

// fetch all the fleet management records
// Service to fetch fleet management records
export const fetchAllFleetManagementService = async (
  limit?: number
): Promise<TSFleetManagement[] | null> => {
  if (limit) {
    return await db.query.FleetManagementTable.findMany({
      limit: limit,
    });
  }
  return await db.query.FleetManagementTable.findMany();
};

// Service to fetch a single fleet management record by ID
export const getFleetManagementByIdService = async (
  id: number
): Promise<TSFleetManagement | undefined> => {
  return await db.query.FleetManagementTable.findFirst({
    where: eq(FleetManagementTable.fleetId, id),
  });
};

// Service to create a new fleet management record
export const createFleetManagementService = async (
  fleet: TIFleetManagement
): Promise<string> => {
  await db.insert(FleetManagementTable).values(fleet).execute();
  return "Fleet management record created successfully";
};

// Service to update a fleet management record by ID
export const updateFleetManagementService = async (
  id: number,
  fleet: Partial<TIFleetManagement>
): Promise<string> => {
  await db
    .update(FleetManagementTable)
    .set(fleet)
    .where(eq(FleetManagementTable.fleetId, id));
  return "Fleet management record updated successfully";
};

// Service to delete a fleet management record by ID
export const deleteFleetManagementService = async (
  id: number
): Promise<string> => {
  await db
    .delete(FleetManagementTable)
    .where(eq(FleetManagementTable.fleetId, id));
  return "Fleet management record deleted successfully";
};

// export class FleetManageService {
//   async getFleetManageList(): Promise<TSFleetManagement[]> {
//     const fleetManageList = await db.select(FleetManagementTable).get();
//     return fleetManageList;
//   }

//   async getFleetManageById(id: number): Promise<TSFleetManagement> {
//     const fleetManage = await db.select(FleetManagementTable).where(eq("id", id)).get();
//     return fleetManage[0];
//   }

//   async createFleetManage(fleetManage: TIFleetManagement): Promise<TSFleetManagement> {
//     const newFleetManage = await db.insert(FleetManagementTable).values(fleetManage).execute();
//     return newFleetManage[0];
//   }

//   async updateFleetManage(id: number, fleetManage: TIFleetManagement): Promise<TSFleetManagement> {
//     const updatedFleetManage = await db.update(FleetManagementTable).set(fleetManage).where(eq("id", id)).execute();
//     return updatedFleetManage[0];
//   }

//   async deleteFleetManage(id: number): Promise<TSFleetManagement> {
//     const deletedFleetManage = await db.delete(FleetManagementTable).where(eq("id", id)).execute();
//     return deletedFleetManage[0];
//   }
// }
