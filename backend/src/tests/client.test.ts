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
import {
  firstClientCredits,
  secondClientCredits,
  thirdClientCredits,
  BookingTestExpertId,
  BookingTestSlotId,
} from "./testData";

let firstClient: any;
let secondClient: any;
let thirdClient: any;

beforeAll(async () => {
  firstClient = await pool.query(
    "INSERT INTO clients (credits) VALUES ($1) RETURNING *",
    [firstClientCredits],
  );

  secondClient = await pool.query(
    "INSERT INTO clients (credits) VALUES ($1) RETURNING *",
    [secondClientCredits],
  );

  thirdClient = await pool.query(
    "INSERT INTO clients (credits) VALUES ($1) RETURNING *",
    [thirdClientCredits],
  );
});

describe("Client credits transactions", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
      BookingTestSlotId,
    ]);

    await pool.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      firstClientCredits,
      firstClient.rows[0].id,
    ]);

    await pool.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      secondClientCredits,
      secondClient.rows[0].id,
    ]);

    await pool.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      thirdClientCredits,
      thirdClient.rows[0].id,
    ]);
  });

  it("should decrease credits after successful booking", async () => {
    const bookingResponse = await request(app).post("/api/booking").send({
      clientId: firstClient.rows[0].id,
      expertId: BookingTestExpertId,
      slotId: BookingTestSlotId,
    });

    expect(bookingResponse.status).toBe(200);

    const result = await pool.query(
      "SELECT credits FROM clients where id = $1",
      [firstClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(firstClientCredits - 100);
  });

  it("should return error not enough credits", async () => {
    const bookingResponse = await request(app).post("/api/booking").send({
      clientId: secondClient.rows[0].id,
      expertId: BookingTestExpertId,
      slotId: BookingTestSlotId,
    });

    expect(bookingResponse.status).toBe(400);
    expect(bookingResponse.body.error).toBe(
      "Client does not have enough credits",
    );

    const result = await pool.query(
      "SELECT credits FROM clients WHERE id = $1",
      [secondClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(secondClientCredits);
  });

  it("duplicate request does not double charge", async () => {
    const firstResponse = await request(app).post("/api/booking").send({
      clientId: firstClient.rows[0].id,
      expertId: BookingTestExpertId,
      slotId: BookingTestSlotId,
    });

    expect(firstResponse.status).toBe(200);

    const secondResponse = await request(app).post("/api/booking").send({
      clientId: firstClient.rows[0].id,
      expertId: BookingTestExpertId,
      slotId: BookingTestSlotId,
    });

    expect(secondResponse.status).toBe(400);

    const result = await pool.query(
      "SELECT credits FROM clients where id = $1",
      [firstClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(firstClientCredits - 100);
  });

  it("should prevent overspending balance during concurrent requests", async () => {
    const requests = Array.from({ length: 4 }, () =>
      request(app).post("/api/booking").send({
        clientId: thirdClient.rows[0].id,
        expertId: BookingTestExpertId,
        slotId: BookingTestSlotId,
      }),
    );

    const response = await Promise.all(requests);

    const successfulResponses = response.filter((e) => e.status == 200);

    expect(successfulResponses.length).toBe(1);

    const result = await pool.query(
      "SELECT credits FROM clients where id = $1",
      [thirdClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(thirdClientCredits - 100);

    const bookings = await pool.query(
      "SELECT * FROM bookings where slot_id = $1",
      [BookingTestSlotId],
    );

    expect(bookings.rowCount).toBe(1);
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM bookings WHERE slot_id = $1", [
    BookingTestSlotId,
  ]);

  await pool.query("DELETE FROM clients where id = $1", [
    firstClient.rows[0].id,
  ]);

  await pool.query("DELETE FROM clients where id = $1", [
    secondClient.rows[0].id,
  ]);

  await pool.query("DELETE FROM clients where id = $1", [
    thirdClient.rows[0].id,
  ]);

  await pool.end();
});
