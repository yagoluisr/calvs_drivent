import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getBookingByUser, insertBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", getBookingByUser)
  .post("", insertBooking);
  
export { bookingRouter };
