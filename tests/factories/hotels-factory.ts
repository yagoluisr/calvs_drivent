import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    }
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number({ min: 2, max: 3 }),
      hotelId,
    },
  });
}

export async function createRoomNoVacancy(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 0,
      hotelId,
    },
    include: {
      Booking: true
    }
  });
}
