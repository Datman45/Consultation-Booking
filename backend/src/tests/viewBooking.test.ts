import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { app } from "../app";
import { pool } from "../db/coonection";
import {
  BookingTestClientId,
  BookingTestExpertId,
  BookingTestSlotId,
  viewBookingTestMissingId,
} from "./testData";

let bookingResponse: any;

beforeAll(async () => {
  bookingResponse = await pool.query(
    "INSERT INTO bookings(client_id, expert_id, slot_id, status, created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [
      BookingTestClientId,
      BookingTestExpertId,
      BookingTestSlotId,
      "pending",
      new Date(),
    ],
  );
});

describe("View bookings", () => {
  it("should view booking by ID", async () => {
    const booking = await request(app).get(
      `/api/booking/${bookingResponse.rows[0].id}`,
    );

    expect(booking.status).toBe(200);

    expect(booking.body.id).toBe(bookingResponse.rows[0].id);
    expect(booking.body.client_id).toBe(BookingTestClientId);
    expect(booking.body.expert_id).toBe(BookingTestExpertId);
    expect(booking.body.slot_id).toBe(BookingTestSlotId);
  });

  it("should return missing ID", async () => {
    const booking = await request(app).get(
      `/api/booking/${viewBookingTestMissingId}`,
    );

    expect(booking.status).toBe(404);
    expect(booking.body.error).toBe(
      `Booking with ${viewBookingTestMissingId} doesn't exist`,
    );
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
    BookingTestSlotId,
  ]);

  await pool.end();
});
