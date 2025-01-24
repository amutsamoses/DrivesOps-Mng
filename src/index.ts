import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import { timeout } from "hono/timeout";
import { cors } from "hono/cors";
import { prometheus } from "@hono/prometheus";
import { HTTPException } from "hono/http-exception";
import { trimTrailingSlash } from "hono/trailing-slash";
import { readFile } from "fs/promises";

//routes
import { userRouter } from "./users/users.router";
import { authenticationRouter } from "./authentication/authentication.router";
import { branchRouter } from "./branches/branches.router";
import { fleetManagementRouter } from "./FleetManagement/FleetManagement.router";
import { vehicleSpecificationsRouter } from "./vehicleSpecification/vehiclespec.router";
import { vehiclesRouter } from "./vehicles/vehicles.router";
import { supportTicketsRouter } from "./support/support.router";
import { bookingsRouter } from "./bookings/booking.router";
import { paymentRouter } from "./payment/payment.router";
import authRouter from "./auth/auth.router";

const app = new Hono();

const { printMetrics, registerMetrics } = prometheus();

const customeTimeoutException = new HTTPException(408, {
  message: "Request Timeout after 10 seconds",
});

// in-built middlewares
app.use(logger()); // logs request and response data to console

// adds csrf token to response header and checks csrf token in request header and prevent csrf attack
app.use(csrf());


app.use(trimTrailingSlash()); // removes trailing slash from request url
// app.use("/api/*", cors()); // adds cors headers to response
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
); // adds cors headers to response

// app.use("*", printMetrics); // adds prometheus metrics to /metrics route
app.use("*", registerMetrics); // adds prometheus metrics to /metrics route
app.use("/", timeout(10000, customeTimeoutException)); // adds timeout to all routes

app.get("/timeout", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000));
  return c.text("Timeout data after 11 seconds", 200);
});

app.get("/", async (c) => {
  try {
    let html = await readFile("./index.html", "utf-8");
    return c.html(html);
  } catch (err: any) {
    return c.text(err.message, 500);
  }
});

//default routes
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

//============routes================
app.route("/", userRouter);
app.route("/", authenticationRouter);
app.route("/", branchRouter);
app.route("/", fleetManagementRouter);
app.route("/", vehicleSpecificationsRouter);
app.route("/", vehiclesRouter);
app.route("/", supportTicketsRouter);
app.route("/", bookingsRouter);
app.route("/", paymentRouter);
app.route("/", authRouter);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT),
});
console.log(`Server is running on ${process.env.PORT}`);
