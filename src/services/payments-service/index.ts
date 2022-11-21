import { notFoundError, unauthorizedError } from "@/errors";
import { PaymentProcessBody } from "@/protocols";
import { paymentsRepository } from "@/repositories/payments-repository";
import { ticketsRepository } from "@/repositories/ticket-repository";

async function getPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.getTicketByUser(ticketId);

  if(!ticket) throw notFoundError();

  if(ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const ticketUser = await paymentsRepository.getPaymentFromTicketId(ticketId);

  return ticketUser;
}

async function postPayment(paymentProcess: PaymentProcessBody, userId: number) {
  const ticket = await ticketsRepository.getTicketByUser(paymentProcess.ticketId);

  if(!ticket) throw notFoundError();

  if(ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const createdPayment = await paymentsRepository.createPayment(paymentProcess, ticket.TicketType.price);

  await ticketsRepository.updateTicketStatus(paymentProcess.ticketId);

  return createdPayment;
}

const paymentsService = {
  getPaymentByTicketId,
  postPayment,
};

export { paymentsService };
