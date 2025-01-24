import { Hono } from "hono";
import {
  listAllBranchesController,
  getBranchByIdController,
  createBranchController,
  updateBranchController,
  deleteBranchController,
} from "./branches.controller";
import { branchSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const branchRouter = new Hono().basePath("/api");

// GET all branches - /api/branches
branchRouter.get("/branches", adminOrUserRoleAuth, listAllBranchesController);

// GET branch by ID - /api/branches/:id
branchRouter.get("/branches/:id", getBranchByIdController);

// POST create a new branch - /api/branches
// branchRouter.post("/branches", createBranchController);
// branchRouter.post(
//   "/branches",
//   zValidator("json", branchSchema),
//   createBranchController
// );

branchRouter.post(
  "/branches",
  zValidator("json", branchSchema, (results, c) => {
    if (!results.success) {
      return c.json(results.error, 400);
    }
  }),

  createBranchController
);

branchRouter.post(
  "/branches",
  zValidator("json", branchSchema),

  createBranchController
);

// PUT update a branch by ID - /api/branches/:id
branchRouter.put("/branches/:id", updateBranchController);

// DELETE a branch by ID - /api/branches/:id
branchRouter.delete("/branches/:id", deleteBranchController);
