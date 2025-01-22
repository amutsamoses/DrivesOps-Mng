import { Context } from "hono"; // To handle Request and Response,
import {
  fetchAllUserService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "./users.service";

// Get all users
export const fetchAllUserController = async (c: Context) => {
  try {
    // limit the number of users to fetch
    const limit = Number(c.req.query("limit"));

    const data = await fetchAllUserService(limit);

    if (data == null || data.length == 0) {
      return c.text("User not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Get user by id
export const getUserByIdController = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid user id", 400);
    }
    const user = await getUserByIdService(id);
    if (user == undefined) {
      return c.text("User not found", 404);
    }
    return c.json(user, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Create user
export const createUserController = async (c: Context) => {
  try {
    const user = await c.req.json();
    const createdUser = await createUserService(user);

    if (!createdUser) {
      return c.text("User not created", 400);
    }
    return c.json(createdUser, 201); // return newly created user object
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Update user by id
export const updateUserController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.text("Invalid user id", 400);
  }
  const user = await c.req.json();
  try {
    // search for the user
    const searchUser = await getUserByIdService(id);
    if (searchUser == undefined) {
      return c.text("User not found", 404);
    }

    // update the user
    const updatedUser = await updateUserService(id, user);

    // return the success message
    if (!updatedUser) {
      return c.text("User not updated", 404);
    }

    return c.json({ msg: "User updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Delete user by id
export const deleteUserController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.text("Invalid user id", 400);
  }
  try {
    const user = await getUserByIdService(id);
    if (user == undefined) {
      return c.text("User not found", 404);
    }

    const deletedUser = await deleteUserService(id);
    if (!deletedUser) {
      return c.text("User not deleted", 404);
    }

    return c.json({ msg: "User deleted successfully" }, 201);
  } catch (error: any) {
    console.error("error deleting user", error);
    return c.json({ error: error?.message }, 400);
  }
};
