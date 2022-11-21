import { requestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { PaymentProcessBody } from "@/protocols";
import { paymentsService } from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);

  if(!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const paymentByTicketId = await paymentsService.getPaymentByTicketId(ticketId, userId);

    return res.status(httpStatus.OK).send(paymentByTicketId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
      
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function InsertPaymentProcess(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const paymentProcess = req.body as PaymentProcessBody; 
  
  if(!paymentProcess) throw requestError(400, "BadRequest");

  try {
    const payment = await paymentsService.postPayment(paymentProcess, userId);
    
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
