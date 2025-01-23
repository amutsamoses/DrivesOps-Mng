import { Hono } from "hono";
import {
  listAllAuthenticationController,
  getAuthenticationByIdController,
  createAuthenticationController,
  updateAuthenticationController,
  deleteAuthenticationController,
} from "./authentication.controller";
import { zValidator } from "@hono/zod-validator";
import { authenticationSchema } from "../validator";
import {
  adminOrUserRoleAuth,
  adminRoleAuth,
  userRoleAuth,
} from "../middleware/bearAuth";

export const authenticationRouter = new Hono();

// GET all authentication - /api/authentication
authenticationRouter.get(
  "/api/authentication",
  adminRoleAuth,
  listAllAuthenticationController
);

// GET a single authentication entry by user ID - /api/auth/:userId
authenticationRouter.get(
  "/api/authentication/:userId",
  adminRoleAuth,
  getAuthenticationByIdController
);

// POST create a new authentication entry - /api/auth
authenticationRouter.post(
  "/api/authentication",
  adminRoleAuth,
  createAuthenticationController
);

// PUT update an authentication entry by user ID - /api/auth/:userId
authenticationRouter.put(
  "/api/authentication/:userId",
  adminRoleAuth,
  updateAuthenticationController
);

// DELETE an authentication entry by user ID - /api/auth/:userId
authenticationRouter.delete(
  "/api/authentication/:userId",
  adminRoleAuth,
  deleteAuthenticationController
);

authenticationRouter.post(
  "/api/authentication",
  zValidator("json", authenticationSchema, (results, c) => {
    if (!results.success) {
      return c.json(results.error, 400);
    }
  }),
  adminRoleAuth,
  createAuthenticationController
);

// export const authenticationRouter = (h: Hono) => {
//   h.get("/authentication", listAllAuthenticationController);
//   h.get("/authentication/:userId", getAuthenticationByIdController);
//   h.post("/authentication", createAuthenticationController);
//   h.put("/authentication/:userId", updateAuthenticationController);
//   h.delete("/authentication/:userId", deleteAuthenticationController);
// };
