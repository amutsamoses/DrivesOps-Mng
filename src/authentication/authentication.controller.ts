import { Context } from "hono";
import {
  fetchAllAuthenticationService,
  getAuthenticationByIdService,
  createAuthenticationService,
  updateAuthenticationService,
  deleteAuthenticationService,
} from "./authentication.service";

// list all authenticated users
export const listAllAuthenticationController = async (c: Context) => {
  try {
    const limit = Number(c.req.query("limit"));
    const data = await fetchAllAuthenticationService(limit);

    if (data == null || data.length == 0) {
      return c.text("Authentication entry not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// get a single authenticated user by user id
export const getAuthenticationByIdController = async (c: Context) => {
  const userId = parseInt(c.req.param("userId"));
  if (isNaN(userId)) {
    return c.text("Invalid user id", 400);
  }

  try {
    const data = await getAuthenticationByIdService(userId);

    if (data == undefined) {
      return c.text("Authentication entry not found", 404);
    }
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// create a new authentication entry
export const createAuthenticationController = async (c: Context) => {
  try {
    const auth = await c.req.json();
    const createdAuth = await createAuthenticationService(auth);

    if (!createdAuth) {
      return c.text("Authentication entry not created", 404);
    }
    return c.json(createdAuth, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// update an authentication entry by user id
export const updateAuthenticationController = async (c: Context) => {
  const userId = parseInt(c.req.param("userId"));
  if (isNaN(userId)) {
    return c.text("Invalid user id", 400);
  }

  const auth = await c.req.json();
  try {
    const updatedAuth = await getAuthenticationByIdService(userId);
    if (updatedAuth == undefined) {
      return c.text("Authentication entry not found", 404);
    }

    const res = await updateAuthenticationService(userId, auth);
    if (!res) {
      return c.text("Authentication entry not updated", 404);
    }
    return c.json({ msg: "Authentication entry updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// delete an authentication entry by user id
export const deleteAuthenticationController = async (c: Context) => {
    const userId = Number(c.req.param("userId"));
    if (isNaN(userId)) {
      return c.text("Invalid user id", 400);
    }

    try{
        const deletedAuth = await getAuthenticationByIdService(userId);
        if (deletedAuth == undefined) {
          return c.text("Authentication entry not found", 404);
        }

        const res = await deleteAuthenticationService(userId);
        if (!res) {
          return c.text("Authentication entry not deleted", 404);
        }
        return c.json({ msg: "Authentication entry deleted successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}