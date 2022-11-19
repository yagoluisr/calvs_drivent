import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { ticketsRepository } from "@/repositories/ticket-repository";

async function getTicketsTypes() {
  const result = await ticketsRepository.getAllTicketsTypes();

  return result;
}

async function getTicketByUser(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);

  if(!ticket) throw notFoundError();

  return ticket;
}

const ticketsService = {
  getTicketsTypes,
  getTicketByUser,
};

export { ticketsService };
