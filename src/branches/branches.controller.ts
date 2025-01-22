import { Context } from "hono";
import {
  fetchAllBrancheService,
  getBranchByIdService,
  createBranchService,
  updateBranchService,
  deleteBranchService,
} from "./branches.service";

// controller to list all branches
export const listAllBranchesController = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    const data = await fetchAllBrancheService(limit);

    if (data == null || data.length == 0) {
      return c.text("Branches not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// controller to get branch by id
export const getBranchByIdController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const branch = await getBranchByIdService(id);
  if (branch == undefined) {
    return c.text("Branch not found", 404);
  }
  return c.json(branch, 200);
};

// controller to create a new branch
export const createBranchController = async (c: Context) => {
  try {
    const branch = await c.req.json();
    const createdBranch = await createBranchService(branch);

    if (!createdBranch) {
      return c.text("Branch not created", 404);
    }
    return c.json(createdBranch, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// controller to update a branch by id
export const updateBranchController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const branch = await c.req.json();
  try {
    const searchedBranch = await getBranchByIdService(id);
    if (searchedBranch == undefined) return c.text("Branch not found", 404);

    const res = await updateBranchService(id, branch);
    if (!res) return c.text("Branch not updated", 404);

    return c.json({ msg: "Branch updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// controller to delete a branch by id

export const deleteBranchController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const branch = await getBranchByIdService(id);
    if (branch == undefined) return c.text("Branch not found", 404);

    const res = await deleteBranchService(id);
    if (!res) return c.text("Branch not deleted", 404);

    return c.json({ msg: "Branch deleted successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
