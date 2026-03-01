import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app.js";
import Booking from "../../Modals/Booking.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Booking.deleteMany({});
});

describe("POST /Payment conflict prevention", () => {
  it("returns 409 for overlapping accommodation booking", async () => {
    const reserveId = new mongoose.Types.ObjectId();

    await Booking.create({
      ReserveId: reserveId,
      category: "accommodation",
      MainTitle: "Test Hotel",
      ScheduleStart: new Date("2026-04-10"),
      ScheduleEnd: new Date("2026-04-15"),
      amount: "100",
    });

    const res = await request(app).post("/Payment").send({
      Pay: {
        amount: 100,
        name: "Test Hotel",
        schedule: "Enjoy your Reserve from 2026-04-12 to 2026-04-14",
      },
      Book: {
        ReserveId: reserveId.toString(),
        category: "accommodation",
        checkInDate: "2026-04-12",
        checkOutDate: "2026-04-14",
      },
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already booked/i);
  });
});
