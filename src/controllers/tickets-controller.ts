import { AuthenticatedRequest } from "@/middlewares";
import { ticketsTypesService } from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsTypesService.getTicketsTypes();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
