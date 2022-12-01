import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true
    }
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: {
      roomId
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  createBooking,
  findBookingByRoomId,
};

export default bookingRepository;
