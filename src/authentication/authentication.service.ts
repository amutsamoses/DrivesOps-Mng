import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import {
  AuthenticationTable,
  TIAuthentication,
  TSAuthentication,
} from "../drizzle/schema";

// fetch all users authenticated
export const fetchAllAuthenticationService = async (
  limit?: number
): Promise<TSAuthentication[] | null> => {
  if (limit) {
    return await db.query.AuthenticationTable.findMany({
      limit: limit,
    });
  }
  return await db.query.AuthenticationTable.findMany();
};

// fetch a single authenticated entry by user id
export const getAuthenticationByIdService = async (
  userId: number
): Promise<TSAuthentication | undefined> => {
  return await db.query.AuthenticationTable.findFirst({
    where: eq(AuthenticationTable.userId, userId),
  });
};

// service to create a new authentication entry
export const createAuthenticationService = async (
  auth: TIAuthentication
): Promise<TIAuthentication | string> => {
  await db.insert(AuthenticationTable).values(auth);
  return "Authentication created successfully";
};

// service to update an authentication entry by user id
export const updateAuthenticationService = async (
  userId: number,
  auth: Partial<TIAuthentication>
): Promise<string> => {
  await db
    .update(AuthenticationTable)
    .set(auth)
    .where(eq(AuthenticationTable.userId, userId));
  return "Authentication updated successfully";
};

// service to delete an authentication entry by user id
export const deleteAuthenticationService = async (
  userId: number
): Promise<string> => {
  try {
    const result = await db
      .delete(AuthenticationTable)
      .where(eq(AuthenticationTable.userId, userId))
      .returning(); // check if the entry was deleted
    if (result.length === 0) {
      return "Authentication entry not found";
    }

    return "Authentication deleted successfully";
  } catch (error: any) {
    console.error("Error deleting authentication entry: ", error.message);
    throw new Error("Error deleting authentication entry");
  }
  // await db
  //   .delete(AuthenticationTable)
  //   .where(eq(AuthenticationTable.userId, userId));
  // return "Authentication deleted successfully";
};
