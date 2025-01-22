import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  SupportTicketsTable,
  TISupportTicket,
  TSSupportTicket,
} from "../drizzle/schema";

// service to list all existing support tickets
export const listAllSupportTicketService = async (
  limit?: number
): Promise<TSSupportTicket[] | null> => {
  if (limit) {
    return await db.query.SupportTicketsTable.findMany({
      limit: limit,
      with: {
        user: {
          columns: {
            email: true,
            fullName: true,
          },
        },
      },
    });
  }
  return await db.query.SupportTicketsTable.findMany();
};

// service to fetch support ticket by id
export const getSupportTicketByIdService = async (
  id: number
): Promise<TSSupportTicket | undefined> => {
  return await db.query.SupportTicketsTable.findFirst({
    where: eq(SupportTicketsTable.ticketId, id),
    with: {
      user: {
        columns: {
          email: true,
          fullName: true,
        },
      },
    },
  });
};

// service to fetch a support ticket by its user id
export const fetchSupportTicketByUserIdService = async (
  userId: number
): Promise<TSSupportTicket[] | null> => {
  return await db.query.SupportTicketsTable.findMany({
    where: eq(SupportTicketsTable.userId, userId),
    with: {
      user: {
        columns: {
          email: true,
          fullName: true,
        },
      },
    },
  });
};

// service to create a new support ticket
export const createSupportTicketService = async (
  ticket: TISupportTicket
): Promise<string> => {
  await db.insert(SupportTicketsTable).values(ticket);
  return "Support ticket created successfully";
};

// service to update a support ticket
export const updateSupportTicketService = async (
  id: number,
  ticket: Partial<TISupportTicket>
): Promise<string> => {
  await db
    .update(SupportTicketsTable)
    .set(ticket)
    .where(eq(SupportTicketsTable.ticketId, id));
  return "Support ticket updated successfully";
};

// service to delete a support ticket
export const deleteSupportTicketService = async (
  id: number
): Promise<string> => {
  await db
    .delete(SupportTicketsTable)
    .where(eq(SupportTicketsTable.ticketId, id));
  return "Support ticket deleted successfully";
};
