import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { BranchesTable, TIBranch, TSBranch } from "../drizzle/schema";

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
  await db.delete(BranchesTable).where(eq(BranchesTable.branchId, id));
  return "Branch deleted successfully";
};
