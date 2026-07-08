import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import { app } from "../app";
import { pool } from "../db/coonection";
import { firstClientCredits, thirdClientCredits } from "./testData";

let firstClient: any;
let secondClient: any;
let expert: any;
let slot: any;

beforeAll(async () => {
  firstClient = await pool.query(
    "INSERT INTO clients (credits) VALUES ($1) RETURNING *",
    [firstClientCredits],
  );

  secondClient = await pool.query(
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
});

describe("Booking creation", () => {
  const firstBody = () => ({
    clientId: firstClient.rows[0].id,
    expertId: expert.rows[0].id,
    slotId: slot.rows[0].id,
  });

  const secondBody = () => ({
    clientId: secondClient.rows[0].id,
    expertId: expert.rows[0].id,
    slotId: slot.rows[0].id,
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
      slot.rows[0].id,
    ]);

    await pool.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      firstClientCredits,
      firstClient.rows[0].id,
    ]);

    await pool.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      thirdClientCredits,
      secondClient.rows[0].id,
    ]);
  });

  it("1. should create a booking successfully", async () => {
    const response = await request(app).post("/api/bookings").send(firstBody());

    expect(response.status).toBe(201);

    expect(response.body.clientId).toBe(firstClient.rows[0].id);
    expect(response.body.expertId).toBe(expert.rows[0].id);
    expect(response.body.slotId).toBe(slot.rows[0].id);
  });

  it("2. should not create duplicate booking for the same submission", async () => {
    const firstResponse = await request(app)
      .post("/api/bookings")
      .send(firstBody());

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/api/bookings")
      .send(firstBody());

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.error).toBe("Slot is already booked");

    const result = await pool.query(
      "SELECT * FROM bookings WHERE slot_id = $1",
      [slot.rows[0].id],
    );

    expect(result.rowCount).toBe(1);

    expect(result.rows[0].id).toBe(firstResponse.body.id);
  });

  it("3. should reject booking when slot is already booked by another client", async () => {
    const firstResponse = await request(app)
      .post("/api/bookings")
      .send(firstBody());

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/api/bookings")
      .send(secondBody());

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.error).toBe("Slot is already booked");

    const result = await pool.query(
      "SELECT * FROM bookings WHERE slot_id = $1",
      [slot.rows[0].id],
    );

    expect(result.rowCount).toBe(1);
  });

  it("4. should prevent multiple concurrent booking requests", async () => {
    const responses = await Promise.all([
      request(app).post("/api/bookings").send(firstBody()),
      request(app).post("/api/bookings").send(firstBody()),
    ]);

    const successfulResponses = responses.filter((e) => e.status === 201);

    expect(successfulResponses.length).toBe(1);

    const result = await pool.query(
      "SELECT * FROM bookings WHERE slot_id = $1",
      [slot.rows[0].id],
    );

    expect(result.rowCount).toBe(1);
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
    slot.rows[0].id,
  ]);
  await pool.query("DELETE FROM slots WHERE id = $1", [slot.rows[0].id]);
  await pool.query("DELETE FROM experts WHERE id = $1", [expert.rows[0].id]);
  await pool.query("DELETE FROM clients WHERE id IN ($1, $2)", [
    firstClient.rows[0].id,
    secondClient.rows[0].id,
  ]);

  await pool.end();
});
