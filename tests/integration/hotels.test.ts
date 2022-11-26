import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createHotel,
  createTicketTypeWithHotels
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should response with status 401 if no token is give", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should response with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
        
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should response with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  describe("when token is valid", () => {
    it("should response with status 401 when user don't have a enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user don't have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should response with status 401 if don't have a ticket type valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const UserEnrollment = await createEnrollmentWithAddress(user);

      const isRemote = false;
      const includesHotel = false;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);
            
      await createTicket(UserEnrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should response with status 402 if user don't have a ticket with 'PAID' status", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const UserEnrollment = await createEnrollmentWithAddress(user);

      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);
            
      createTicket(UserEnrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    // it("should response with empty array if user have a ticket with 'PAID' status but in ticket type is remote", async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken();
    //   const UserEnrollment = await createEnrollmentWithAddress(user);

    //   const isRemote = true;
    //   const includesHotel = false;
    //   const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);
            
    //   const ticket = await createTicket(UserEnrollment.id, ticketType.id, TicketStatus.PAID);

    //   const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    //   expect(response.status).toBe([]);
    // });

    it("should response with status 200 and with existing hotels data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      
      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotels = await createHotel();
            
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: hotels.id,
          name: hotels.name,
          image: hotels.image,
          createdAt: hotels.createdAt.toISOString(),
          updatedAt: hotels.updatedAt.toISOString()
        },
      ]);
    });
  });
});

