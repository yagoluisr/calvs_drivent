import { notFoundError, requestError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { hotelsRepository } from "@/repositories/hotels-repository";
import { ticketsRepository } from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function verifyEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw unauthorizedError();

  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);

  if(!ticket) throw unauthorizedError();
   
  if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw unauthorizedError();
    
  if(ticket.status !== TicketStatus.PAID) throw requestError(402, "PaymenteRequired");
}

async function getHotelsData(userId: number) {
  await verifyEnrollmentAndTicket(userId);
    
  const hotels = await hotelsRepository.getAllHotels();
   
  return hotels;
}

async function getHotelByWithRooms(hotelId: number, userId: number) {
  await verifyEnrollmentAndTicket(userId);
    
  const hotel = await hotelsRepository.getHotelByIdWithRooms(hotelId);
   
  if (!hotel) throw notFoundError();

  return hotel;
}

export const hotelsService = {
  getHotelsData,
  getHotelByWithRooms
};
