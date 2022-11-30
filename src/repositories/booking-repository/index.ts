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

const bookingRepository = {
  findBookingByUserId,

};

export default bookingRepository;
