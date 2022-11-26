import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.firstName(),
      image: faker.image.imageUrl()
    }
  });
}

