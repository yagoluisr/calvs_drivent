import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if(!booking) throw notFoundError();

  return booking;
}

// async function getHotels(userId: number) {
//   await listHotels(userId);

//   const hotels = await hotelRepository.findHotels();
//   return hotels;
// }

// async function getHotelsWithRooms(userId: number, hotelId: number) {
//   await listHotels(userId);
//   const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

//   if (!hotel) {
//     throw notFoundError();
//   }
//   return hotel;
// }

const bookingService = {
  getBooking,
  
};

export default bookingService;
