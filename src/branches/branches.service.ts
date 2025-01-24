import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { BranchesTable, TIBranch, TSBranch } from "../drizzle/schema";
import { deleteBookingService } from "../bookings/booking.service";

// service to fetch all branches
export const fetchAllBrancheService = async (
  limit?: number
): Promise<TSBranch[] | null> => {
  if (limit) {
    return await db.query.BranchesTable.findMany({
      limit: limit,
    });
  }
  return await db.query.BranchesTable.findMany();
};

// service to fetch branch by id
export const getBranchByIdService = async (
  id: number
): Promise<TSBranch | undefined> => {
  return await db.query.BranchesTable.findFirst({
    where: eq(BranchesTable.branchId, id),
  });
};

// service to create branch
// Service to create a new branch
export const createBranchService = async (
  branch: TIBranch
): Promise<string> => {
  await db.insert(BranchesTable).values(branch);
  return "Branch created successfully";
};

// Service to update a branch by ID
export const updateBranchService = async (
  id: number,
  branch: Partial<TIBranch>
): Promise<string> => {
  await db
    .update(BranchesTable)
    .set(branch)
    .where(eq(BranchesTable.branchId, id));
  return "Branch updated successfully";
};

// Service to delete a branch by ID
export const deleteBranchService = async (id: number): Promise<string> => {
  try {
    const branchDelete = await deleteBookingService(id);
    console.log(branchDelete);
    if (branchDelete === "Booking not found") {
      console.warn(
        `Booking record not found for branch ${id}. Proceeding with branch deletion.`
      );
    } else if (
      branchDelete !== "Booking deleted successfully" &&
      branchDelete !== "Booking not found"
    ) {
      throw new Error("Failed to delete branch entry");
    }
    const deletedBranch = await db
      .delete(BranchesTable)
      .where(eq(BranchesTable.branchId, id))
      .returning();
    if (deletedBranch.length === 0) {
      return "Branch not found";
    }
    return "Branch deleted successfully";
  } catch (error: any) {
    console.error("Error deleting Branch:", error);
    throw new Error("Failed to delete branch entry");
  }
};
