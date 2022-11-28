import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createTicketTypeWithHotels,
  createHotelWithRooms,
  createPayment,
  createHotel
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

    it("should response with status 200 and with existing hotels data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      
      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotels = await createHotelWithRooms();
            
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

describe("Get /hotels/:hotelId", () => {
  it("should response with status 401 if no token is give", async () => {
    const response = await server.get("/hotels/1");
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should response with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
          
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should response with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
      
  describe("when token is valid", () => {
    it("should response with status 401 when user don't have a enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
            
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user don't have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
  
      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
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

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
            
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

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
            
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should response with status 404 when there is no hotel with that hotelId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      
      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);
      
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and an empty array for Rooms when the hotel has no rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelWithoutRooms = await createHotel();

      const response = await server.get(`/hotels/${hotelWithoutRooms.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: hotelWithoutRooms.id,
        name: hotelWithoutRooms.name,
        image: hotelWithoutRooms.image,
        createdAt: hotelWithoutRooms.createdAt.toISOString(),
        updatedAt: hotelWithoutRooms.updatedAt.toISOString(),
        Rooms: [],
      });
    });

    it("should response with 200 and hotel with rooms data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const isRemote = false;
      const includesHotel = true;
      const ticketType = await createTicketTypeWithHotels(isRemote, includesHotel);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotelWithRooms();

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
        Rooms: [
          {
            id: hotel.Rooms[0].id,
            name: hotel.Rooms[0].name,
            capacity: hotel.Rooms[0].capacity,
            hotelId: hotel.Rooms[0].hotelId,
            createdAt: hotel.Rooms[0].createdAt.toISOString(),
            updatedAt: hotel.Rooms[0].updatedAt.toISOString(),
          },
          {
            id: hotel.Rooms[1].id,
            name: hotel.Rooms[1].name,
            capacity: hotel.Rooms[1].capacity,
            hotelId: hotel.Rooms[1].hotelId,
            createdAt: hotel.Rooms[1].createdAt.toISOString(),
            updatedAt: hotel.Rooms[1].updatedAt.toISOString(),
          },
        ]
      });
    });
  });
});
