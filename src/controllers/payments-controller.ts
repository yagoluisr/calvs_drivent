import { AuthenticatedRequest } from "@/middlewares";
import { paymentsService } from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);

  if(!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const paymentByTicketId = await paymentsService.getPaymentByTicketId(ticketId, userId);

    return res.sendStatus(httpStatus.OK).send(paymentByTicketId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
      
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
