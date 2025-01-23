import { Hono } from "hono";
import {
  listAllPaymentsController,
  getSinglePaymentController,
  createPaymentController,
  updatePaymentController,
  deletePaymentController,
} from "./payment.controller";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const paymentRouter = new Hono().basePath("/api");

// GET all payments - /api/payments
paymentRouter.get("/payments", adminOrUserRoleAuth, listAllPaymentsController);

// GET a single payment by ID - /api/payments/:id
paymentRouter.get(
  "/payments/:id",
  adminOrUserRoleAuth,
  getSinglePaymentController
);

// POST create a new payment - /api/payments
// paymentRouter.post("/payments",zValidator("json", paymentSchema),userRoleAuth , createPayment);

// PUT update a payment by ID - /api/payments/:id
paymentRouter.put(
  "/payments/:id",
  adminOrUserRoleAuth,
  updatePaymentController
);

// DELETE a payment by ID - /api/payments/:id
paymentRouter.delete("/payments/:id", adminRoleAuth, deletePaymentController);

paymentRouter.post(
  "/create-checkout-session",
  createPaymentController.createCheckoutSession
);
paymentRouter.post("/webhook", createPaymentController.handleWebhook);
paymentRouter.get(
  "/test-checkout-session",
  createPaymentController.testingCreatedCheckoutSession
);
