import db from "../drizzle/db";
import { UsersTable, AuthenticationTable } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import { z } from "zod";

// defining a zod schema for user registration data
const UserRegistrationSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  contactPhone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" }),
  address: z.string(),
  role: z.enum(["admin", "user"]).optional().default("user"),
  password: z.string().min(8),
});

// data to be passed to the user registration endpoint
type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;

// service function for a registration
export const registerUserService = async (
  data: UserRegistrationData
): Promise<string | null> => {
  const parsedData = UserRegistrationSchema.parse(data);

  const client = await db.transaction(async (tx) => {
    const userInsertResult = await tx
      .insert(UsersTable)
      .values({
        fullName: parsedData.fullName,
        email: parsedData.email,
        contactPhone: parsedData.contactPhone,
        address: parsedData.address,
        role: parsedData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ userId: UsersTable.userId });

    const userId = userInsertResult[0].userId;

    await tx.insert(AuthenticationTable).values({
      userId,
      password: parsedData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  console.log(client);
  return "User registered successfully";
};

export interface TUser {
  userId: number;
  fullName: string;
  email: string;
  contactPhone: string;
  address: string;
  role: string;
  password: string;
}

export interface TUserAuthDetails {
  email: string;
  password: string;
}

export interface TAuthentication {
  password: string | null;
}

export interface TBooking {
  bookingId: number;
}

export interface TUserAuthDetails {
  password: string;
  email: string;
}

export interface TLogin {
  userId: number;
  email: string | null;
  fullName: string | null;
  role: "admin" | "user" | null;
  authentication: TAuthentication;
  bookings: TBooking[];
}

export const userLoginService = async (
  user: TUserAuthDetails
): Promise<TLogin | null> => {
  const { email, password } = user;
  const result = await db.query.UsersTable.findFirst({
    columns: {
      userId: true,
      fullName: true,
      email: true,
      role: true,
    },
    where: sql`${UsersTable.email} = ${email}`,
    with: {
      authentication: {
        columns: {
          password: true,
        },
      },
      bookings: {
        columns: {
          bookingId: true,
        },
      },
    },
  });
  console.log("Searching for user with email:", email);
  console.log("Database result:", result);

  return result || null;
};
