import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";
import { app } from "../app";
import { pool } from "../db/coonection";
import {
  BookingTestClientId,
  BookingTestExpertId,
  BookingTestSlotId,
} from "./testData";
describe("Booking creation", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
      BookingTestSlotId,
    ]);
  });

  const body = {
    clientId: BookingTestClientId,
    expertId: BookingTestExpertId,
    slotId: BookingTestSlotId,
  };

  it("should create a booking successfully", async () => {
    const response = await request(app).post("/api/bookings").send(body);

    expect(response.status).toBe(200);
    expect(response.body.clientId).toBe(BookingTestClientId);
    expect(response.body.expertId).toBe(BookingTestExpertId);
    expect(response.body.slotId).toBe(BookingTestSlotId);
  });

  it("should reject booking when slot is already booked", async () => {
    const firstResponse = await request(app).post("/api/bookings").send(body);
    const secondResponse = await request(app).post("/api/bookings").send(body);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.error).toBe("Slot is already booked");

    const result = await pool.query(
      "SELECT * FROM bookings where slot_id = $1",
      [BookingTestSlotId],
    );

    expect(result.rowCount).toBe(1);
  });

  it("should prevent multiple concurrent booking requests", async () => {
    const requests = Array.from({ length: 4 }, () =>
      request(app).post("/api/bookings").send(body),
    );

    const response = await Promise.all(requests);

    const successfulResponses = response.filter((e) => e.status == 200);
    expect(successfulResponses.length).toBe(1);

    const result = await pool.query(
      "SELECT * FROM bookings where slot_id = $1",
      [BookingTestSlotId],
    );

    expect(result.rowCount).toBe(1);
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
    BookingTestSlotId,
  ]);

  await pool.end();
});
