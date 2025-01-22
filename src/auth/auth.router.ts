import { Hono } from "hono";
import { registerUserController, loginUserController } from "./auth.controller";
import { zValidator } from "@hono/zod-validator";
import { loginUserSchema } from "../validator";

export const authRouter = new Hono();

authRouter.post("/register", registerUserController);
authRouter.post(
  "/login",
  zValidator("json", loginUserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  loginUserController
);

// default export authRouter;
export default authRouter;
