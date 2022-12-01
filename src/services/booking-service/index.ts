import { notFoundError, unauthorizedError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-room-error";
import bookingRepository from "@/repositories/booking-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { hotelsRepository } from "@/repositories/hotels-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { ticketsService } from "../tickets-service";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if(!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const ticket = await ticketsService.getTicketByUser(userId);
  
  if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== TicketStatus.PAID) {
    throw unauthorizedError();
  }

  const room = await hotelRepository.getRoomById(roomId);

  if(!room) throw notFoundError();

  if(room.capacity <= room.Booking.length) throw forbiddenError();

  const insertedBooking = await bookingRepository.createBooking(userId, roomId);

  return insertedBooking;
}

const bookingService = {
  getBooking,
  postBooking,
};

export default bookingService;
