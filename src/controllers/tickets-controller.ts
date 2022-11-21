import { AuthenticatedRequest } from "@/middlewares";
import { TicketTypeBody } from "@/protocols";
import { ticketsService } from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketsTypes();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await ticketsService.getTicketByUser(userId);

    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body as TicketTypeBody;

  if(!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticketInserted = await ticketsService.insertTicket(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(ticketInserted);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
