import { prisma } from "@/config";
import { Address, Enrollment } from "@prisma/client";

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

async function insertTicketType(ticketTypeId: number, enrollment: enrollmentResult) {
  return prisma.ticket.create({
    data: {
      enrollmentId: enrollment.id,
      ticketTypeId: ticketTypeId,
      status: "RESERVED"
    },
    select: {
      id: true,
      status: true, //RESERVED 
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    }
  }); 
}

type enrollmentResult = Enrollment & {
  Address: Address[];
}

const ticketsRepository = {
  getAllTicketsTypes,
  getTicketByEnrollmentId,
  insertTicketType,
};

export { ticketsRepository };
