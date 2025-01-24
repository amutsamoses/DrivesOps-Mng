import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  fetchAllUserController,
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./users.controller";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const userRouter = new Hono().basePath("/api");
// Get all users - /api/users
userRouter.get("/users", adminRoleAuth, fetchAllUserController);

// Get user by id - /api/users/:id
userRouter.get("/users/:id", adminOrUserRoleAuth, getUserByIdController);

// Create user - /api/users
userRouter.post("/users", adminOrUserRoleAuth, createUserController);

// Update user by id - /api/users/:id
userRouter.put("/users/:id", adminOrUserRoleAuth, updateUserController);

// Delete user by id - /api/users/:id
userRouter.delete("/users/:id", adminRoleAuth, deleteUserController);

// Apply middleware to the router
