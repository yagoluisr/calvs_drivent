import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getBookingByUser, insertBooking, updateBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", getBookingByUser)
  .post("", insertBooking)
  .put("/:bookingId", updateBooking);
  
export { bookingRouter };
