import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { app } from "../app";
import { pool } from "../db/coonection";
import { thirdClientCredits, viewBookingTestMissingId } from "./testData";

let client: any;
let expert: any;
let slot: any;
let bookingResponse: any;

beforeAll(async () => {
  client = await pool.query(
    "INSERT INTO clients (credits) VALUES ($1) RETURNING *",
    [thirdClientCredits],
  );

  expert = await pool.query(
    "INSERT INTO experts (first_name, last_name) VALUES ($1, $2) RETURNING *",
    ["Harry", "Kane"],
  );

  slot = await pool.query(
    "INSERT INTO slots (expert_id, date) VALUES ($1, $2) RETURNING *",
    [expert.rows[0].id, "2026-08-10 15:00:00"],
  );

  bookingResponse = await pool.query(
    "INSERT INTO bookings(client_id, expert_id, slot_id, status, created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [
      client.rows[0].id,
      expert.rows[0].id,
      slot.rows[0].id,
      "CONFIRMED",
      new Date(),
    ],
  );
});

describe("View bookings", () => {
  it("5. should return booking by ID", async () => {
    const response = await request(app).get(
      `/api/bookings/${bookingResponse.rows[0].id}`,
    );

    expect(response.status).toBe(200);

    expect(response.body.id).toBe(bookingResponse.rows[0].id);
    expect(response.body.clientId).toBe(client.rows[0].id);
    expect(response.body.expertId).toBe(expert.rows[0].id);
    expect(response.body.slotId).toBe(slot.rows[0].id);
  });

  it("6. should return 404 for missing booking ID", async () => {
    const response = await request(app).get(
      `/api/bookings/${viewBookingTestMissingId}`,
    );

    expect(response.status).toBe(404);

    expect(response.body.error).toBe(
      `Booking with ${viewBookingTestMissingId} doesn't exist`,
    );
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
    slot.rows[0].id,
  ]);

  await pool.query("DELETE FROM slots WHERE id = $1", [slot.rows[0].id]);

  await pool.query("DELETE FROM experts WHERE id = $1", [expert.rows[0].id]);

  await pool.query("DELETE FROM clients WHERE id = $1", [client.rows[0].id]);

  await pool.end();
});
