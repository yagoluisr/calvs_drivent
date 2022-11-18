import { ticketsRepository } from "@/repositories/ticket-repository";

async function getTicketsTypes() {
  const result = await ticketsRepository.getAllTicketsTypes();

  return result;
}

const ticketsTypesService = {
  getTicketsTypes,
};

export { ticketsTypesService };
