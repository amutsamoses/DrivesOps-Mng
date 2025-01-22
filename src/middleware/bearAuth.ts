import { Hono, Context, Next } from "hono";
import { jwt, verify } from "hono/jwt";
import "dotenv/config";

export interface TPayload {
  sub: string;
  role: string;
  exp: number;
}

// authentiication middleware  to verify and decode JWT token
export const verifyToken = async (
  token: string, // token to be verified from request header
  secret: string // secret key for decoding
): Promise<TPayload | null> => {
  try {
    // Verify the token using the secret key. Casting result as 'unknown' ensures we handle it safely.
    const decoded = (await verify(token, secret)) as unknown as TPayload;

    // Return the decoded token payload if verification succeeds
    return decoded;
  } catch (error: any) {
    console.error("Token verification failed:", error.message); // Log error message if verification fails
    return null;
  }
};

// authorization middleware
export const bearAuthMiddleware = async (
  c: Context,
  next: Next,
  requiredRoles: string[]
) => {
  const token = c.req.header("Authorization");
  if (!token) {
    console.warn("No token provided in the request header."); // Log missing token
    return c.json({ error: "Authorization token is required." }, 401);
  }

  const decoded = await verifyToken(token, process.env.JWT_SECRET as string);
  if (!decoded) {
    console.warn("Invalid or expired token provided."); // Log invalid token
    return c.json({ error: "Invalid or expired token." }, 401);
  }

  // Check if the decoded role matches the required roles or is a superuser
  if (!requiredRoles.includes(decoded.role) && decoded.role !== "superuser") {
    console.warn(
      `Unauthorized access attempt by user with role: ${decoded.role}`
    );
    return c.json({ error: "Unauthorized Access: Permission denied" }, 401);
  }

  // Proceed to the next middleware if all checks pass
  return next();
};

// Middleware for admin-only access
export const adminRoleAuth = async (c: Context, next: Next) => {
  await bearAuthMiddleware(c, next, ["admin"]);
};

// Middleware for user-only access
export const userRoleAuth = async (c: Context, next: Next) => {
  await bearAuthMiddleware(c, next, ["user"]);
};

// Middleware for both admin and user access
export const adminOrUserRoleAuth = async (c: Context, next: Next) => {
  await bearAuthMiddleware(c, next, ["admin", "user"]);
};
