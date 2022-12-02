import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBookingByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(Number(userId));
    
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function insertBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const insertedBooking = await bookingService.postBooking(Number(userId), Number(roomId));
    
    return res.status(httpStatus.OK).send({ 
      bookingId: insertedBooking.id 
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;

  try {
    const updatedBooking = await bookingService.updateBookingId(Number(userId), Number(roomId), Number(bookingId));
    
    return res.status(httpStatus.OK).send({ 
      bookingId: updatedBooking.id 
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
