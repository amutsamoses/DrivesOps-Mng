import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  UsersTable,
  TIUser,
  TSUser,
  AuthenticationTable,
} from "../drizzle/schema";
import { deleteAuthenticationService } from "../authentication/authentication.service";

// service to fetch users
export const fetchAllUserService = async (
  limit?: number
): Promise<TSUser[] | null> => {
  if (limit) {
    return await db.query.UsersTable.findMany({ limit: limit });
  }
  return await db.query.UsersTable.findMany();
};

// service to fetch single user by id
export const getUserByIdService = async (
  id: number
): Promise<TSUser | undefined> => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, id),
  });
};

// service to create a new user
export const createUserService = async (
  user: TIUser
): Promise<TIUser | string> => {
  await db.insert(UsersTable).values(user);
  return "User created successfully";
};

// service to update user by id
export const updateUserService = async (
  id: number,
  user: TIUser
): Promise<string> => {
  await db.update(UsersTable).set(user).where(eq(UsersTable.userId, id));
  return "User updated successfully";
};

// service to delete user by id
export const deleteUserService = async (
  id: number
): Promise<TIUser | string> => {
  try {
    const authDeleted = await deleteAuthenticationService(id);
    console.log(authDeleted);
    if (authDeleted === "Authentication entry not found") {
      console.warn(
        `Authentication record not found for user ${id}. Proceeding with user deletion.`
      );
    } else if (
      authDeleted !== "Authentication deleted successfully" &&
      authDeleted !== "Authentication entry not found"
    ) {
      throw new Error("Failed to delete authentication entry"); //Re-throw the error if something unexpected happened
    }

    const deletedUser = await db
      .delete(UsersTable)
      .where(eq(UsersTable.userId, id))
      .returning();
    if (deletedUser.length === 0) {
      throw new Error("User not found");
    }
    return "User deleted successfully";
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    throw new Error("Failed to delete user");
  }
  // await db.delete(UsersTable).where(eq(UsersTable.userId, id));
  // return "User deleted successfully";
};
