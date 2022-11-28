import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createHotelWithRooms() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.city(),
      Rooms: {
        createMany: {
          data: [
            {
              name: faker.name.findName(),
              capacity: faker.datatype.number({ min: 1, max: 3 }),
            },
            {
              name: faker.name.findName(),
              capacity: faker.datatype.number({ min: 1, max: 3 }),
            },
          ],
        },
      },
    },
    include: { 
      Rooms: { 
        orderBy: {
          id: "asc" 
        } 
      } 
    },
  });
}
