import { getAllTicketsType } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import express from "express";

const ticketsRouter = express();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getAllTicketsType);

export { ticketsRouter };
