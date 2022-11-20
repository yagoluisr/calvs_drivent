import { notFoundError, unauthorizedError } from "@/errors";
import { paymentsRepository } from "@/repositories/payments-repository";
import { ticketsRepository } from "@/repositories/ticket-repository";

async function getPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.getTicketByUser(ticketId);

  if(!ticket) throw notFoundError();

  if(ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const ticketUser = await paymentsRepository.getPaymentFromTicketId(ticketId);

  return ticketUser;
}

const paymentsService = {
  getPaymentByTicketId,
};

export { paymentsService };
