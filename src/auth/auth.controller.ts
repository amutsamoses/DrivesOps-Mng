import "dotenv/config";
import { Context } from "hono";
import { registerUserService, userLoginService } from "./auth.service";
import { sendWelcomeEmail } from "../mailer";
import bycrpt from "bcrypt";
import assert from "assert";
import { sign } from "hono/jwt";

assert(process.env.JWT_SECRET, "JWT_SECRET is not defined");

export const registerUserController = async (c: Context) => {
  try {
    const user = await c.req.json();
    const password = user.password;
    const hashedPassword = await bycrpt.hash(password, 10);
    user.password = hashedPassword;

    const newUser = await registerUserService(user);
    if (!newUser) {
      return c.text("User not created", 404);
    }
    console.log(user.email);

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (error: any) {
      console.error("Failed to send email", error.message);
      return c.json({ message: "User registered successful email sent" }, 400);
    }

    return c.json({ msg: newUser }, 201);
  } catch (error: any) {
    console.error("Failed to create user", error.message);
    return c.json({ error: error?.message }, 400);
  }
};

export interface TUser {
  fullName: string;
  contactPhone: string;
  address: string;
  userId: number;
  role: string;
  email: string;
}

export interface TUserAuthDetails {
  password: string;
  user: TUser;
}

export const loginUserController = async (c: Context) => {
  try {
    // extracting email and password from request body
    const { email, password } = await c.req.json();

    // authentication of user
    const userExists = await userLoginService({ email, password });

    // if user does not exist
    if (!userExists) {
      console.log("User Exists Data:", JSON.stringify(userExists, null, 2));

      console.warn("User not found for email:", email);
      return c.json({ message: "User not found" }, 404);
    }

    console.log(
      "User's hashed password from DB:",
      userExists.authentication.password
    );
    console.log("Provided password for comparison:", password);

    // check if password is correct using bcrypt
    const passwordMatch = await bycrpt.compare(
      password,
      userExists.authentication.password as string
    );

    if (!passwordMatch) {
      console.warn("Password mismatch provided by user", userExists.email);
      return c.json({ message: "Incorrect password" }, 401);
    }

    // JWT Payload
    const Payload = {
      sub: userExists.email,
      role: userExists.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 4800, // 8 hours
    };

    // Signing JWT
    const secret = process.env.JWT_SECRET as string;
    const token = await sign(Payload, secret);

    // Sending JWT token in response
    const responseData = {
      token,
      user: {
        userId: userExists.userId,
        fullName: userExists.fullName,
        email: userExists.email,
        role: userExists.role,
        bookingId: userExists.bookings,
      },
    };

    return c.json(responseData, 200); // return token and user details
  } catch (error: any) {
    console.error("Failed to login user", error.message);
    return c.json({ error: error?.message }, 400);
  }
};
