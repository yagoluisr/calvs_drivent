import { prisma } from "@/config";

async function getAllHotels() {
  return prisma.hotel.findMany();
}

async function getHotelByIdWithRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

export const hotelsRepository = {
  getAllHotels,
  getHotelByIdWithRooms
};
