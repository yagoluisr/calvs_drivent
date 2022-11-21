import { prisma } from "@/config";
import { PaymentProcessBody } from "@/protocols";

async function getPaymentFromTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId
    }
  });
}

async function createPayment(paymentProcess: PaymentProcessBody, value: number) {
  return prisma.payment.create({
    data: {
      ticketId: paymentProcess.ticketId,
      value: value,
      cardIssuer: paymentProcess.cardData.issuer, // VISA | MASTERCARD
      cardLastDigits: ((paymentProcess.cardData.number).toString()).slice(-4),
      createdAt: new Date,
      updatedAt: new Date,
    }
  });
}

const paymentsRepository = {
  getPaymentFromTicketId,
  createPayment,
};

export { paymentsRepository };
