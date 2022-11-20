import { prisma } from "@/config";

async function getPaymentFromTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId
    }
  });
}

const paymentsRepository = {
  getPaymentFromTicketId,
};

export { paymentsRepository };
