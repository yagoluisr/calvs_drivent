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

async function upsertBooking(userId: number, roomId: number, bookingId?: number) {
  return prisma.booking.upsert({
    where: {
      id: bookingId || 0
    },
    update: {
      roomId
    },
    create: {
      userId,
      roomId
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoomId,
  upsertBooking
};

export default bookingRepository;
