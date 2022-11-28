import { AuthenticatedRequest } from "@/middlewares";
import { hotelsService } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  
  try {
    const hotels = await hotelsService.getHotelsData(userId);
      
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "RequestError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
      
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}

export async function getHotelWithRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
    
  try {
    const hotel = await hotelsService.getHotelByWithRooms(hotelId, userId);

    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === "RequestError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
