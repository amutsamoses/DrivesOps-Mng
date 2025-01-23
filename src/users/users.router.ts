import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  fetchAllUserController,
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./users.controller";
import { adminOrUserRoleAuth } from "../middleware/bearAuth";

export const userRouter = new Hono().basePath("/api");
// Get all users - /api/users
userRouter.get("/users", fetchAllUserController);

// Get user by id - /api/users/:id
userRouter.get("/users/:id", getUserByIdController);

// Create user - /api/users
userRouter.post("/users", createUserController);

// Update user by id - /api/users/:id
userRouter.put("/users/:id", updateUserController);

// Delete user by id - /api/users/:id
userRouter.delete("/users/:id", deleteUserController);

// Apply middleware to the router
