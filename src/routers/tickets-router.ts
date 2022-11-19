import { getAllTicketsType, getTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import express from "express";

const ticketsRouter = express();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getAllTicketsType)
  .get("/", getTicket);

export { ticketsRouter };
