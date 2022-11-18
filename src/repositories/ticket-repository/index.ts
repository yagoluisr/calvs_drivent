import { prisma } from "@/config";

async function getAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

const ticketsRepository = {
  getAllTicketsTypes,
};

export { ticketsRepository };
