import { prisma } from "@/config";

async function getAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function getTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId
    },
    include: {
      TicketType: true
    }
  });
}

const ticketsRepository = {
  getAllTicketsTypes,
  getTicketByEnrollmentId,
};

export { ticketsRepository };
