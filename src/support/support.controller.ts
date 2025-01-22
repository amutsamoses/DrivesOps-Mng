import { Context } from "hono";
import {
  fetchSupportTicketByUserIdService,
  getSupportTicketByIdService,
  listAllSupportTicketService,
  createSupportTicketService,
  updateSupportTicketService,
  deleteSupportTicketService,
} from "./support.service";

// list all support tickets with optional limit
export const listAllSupportTicketController = async (c: Context) => {
  try {
    const limit = Number(c.req.param("limit"));
    const data = await listAllSupportTicketService(limit);

    if (data == null || data.length == 0) {
      return c.text("Support Ticket not found", 404);
    }

    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Get a single support ticket by ID
export const getSupportTicketByIdController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const ticket = await getSupportTicketByIdService(id);
  if (ticket == undefined) {
    return c.text("Support ticket not found", 404);
  }
  return c.json(ticket, 200);
};

// Create a new support ticket
export const createSupportTicketController = async (c: Context) => {
  try {
    const ticket = await c.req.json();
    const createdTicket = await createSupportTicketService(ticket);

    if (!createdTicket) {
      return c.text("Support ticket not created", 404);
    }
    return c.json(createdTicket, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Update an existing support ticket by ID
export const updateSupportTicketController = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const ticket = await c.req.json();
  try {
    const searchedTicket = await getSupportTicketByIdService(id);
    if (searchedTicket == undefined)
      return c.text("Support ticket not found", 404);

    const res = await updateSupportTicketService(id, ticket);
    if (!res) return c.text("Support ticket not updated", 404);

    return c.json({ msg: "Support ticket updated successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Delete a support ticket by ID
export const deleteSupportTicketController = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    const ticket = await getSupportTicketByIdService(id);
    if (ticket == undefined) return c.text("Support ticket not found", 404);

    const res = await deleteSupportTicketService(id);
    if (!res) return c.text("Support ticket not deleted", 404);

    return c.json({ msg: "Support ticket deleted successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Get support tickets by user ID
export const fetchUserSupportTicketsController = async (c: Context) => {
  const userId = parseInt(c.req.param("userId"));
  if (isNaN(userId)) return c.text("Invalid User ID", 400);

  try {
    const tickets = await fetchSupportTicketByUserIdService(userId);
    if (tickets == null || tickets.length == 0) {
      return c.text("No support tickets found for this user", 404);
    }
    return c.json(tickets, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
