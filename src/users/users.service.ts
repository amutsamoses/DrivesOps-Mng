import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { UsersTable, TIUser, TSUser } from "../drizzle/schema";

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
export const deleteUserService = async (id: number): Promise<TIUser | string> => {
  await db.delete(UsersTable).where(eq(UsersTable.userId, id));
  return "User deleted successfully";
};
