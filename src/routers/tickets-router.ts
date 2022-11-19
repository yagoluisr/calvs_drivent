import { getAllTicketsType, getTicket, postTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import express from "express";

const ticketsRouter = express();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getAllTicketsType)
  .get("/", getTicket)
  .post("/", postTicket);

export { ticketsRouter };
