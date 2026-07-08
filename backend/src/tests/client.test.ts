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
} from "./testData";

let firstClient: any;
let secondClient: any;
let thirdClient: any;
let expert: any;
let firstSlot: any;
let secondSlot: any;

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

  expert = await pool.query(
    "INSERT INTO experts (first_name, last_name) VALUES ($1, $2) RETURNING *",
    ["Harry", "Kane"],
  );

  firstSlot = await pool.query(
    "INSERT INTO slots (expert_id, date) VALUES ($1, $2) RETURNING *",
    [expert.rows[0].id, "2026-08-10 15:00:00"],
  );

  secondSlot = await pool.query(
    "INSERT INTO slots (expert_id, date) VALUES ($1, $2) RETURNING *",
    [expert.rows[0].id, "2026-08-10 16:00:00"],
  );
});

describe("Client credits transactions", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM bookings WHERE slot_id IN ($1, $2)", [
      firstSlot.rows[0].id,
      secondSlot.rows[0].id,
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

  it("7. should charge credits after successful booking", async () => {
    const response = await request(app).post("/api/bookings").send({
      clientId: firstClient.rows[0].id,
      expertId: expert.rows[0].id,
      slotId: firstSlot.rows[0].id,
    });

    expect(response.status).toBe(201);

    const result = await pool.query(
      "SELECT credits FROM clients WHERE id = $1",
      [firstClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(firstClientCredits - 100);
  });

  it("8. should return 403 error for not enough credits", async () => {
    const response = await request(app).post("/api/bookings").send({
      clientId: secondClient.rows[0].id,
      expertId: expert.rows[0].id,
      slotId: firstSlot.rows[0].id,
    });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Client does not have enough credits");

    const result = await pool.query(
      "SELECT credits FROM clients WHERE id = $1",
      [secondClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(secondClientCredits);
  });

  it("9. should not double charge duplicate requests", async () => {
    const firstResponse = await request(app).post("/api/bookings").send({
      clientId: firstClient.rows[0].id,
      expertId: expert.rows[0].id,
      slotId: firstSlot.rows[0].id,
    });

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app).post("/api/bookings").send({
      clientId: firstClient.rows[0].id,
      expertId: expert.rows[0].id,
      slotId: firstSlot.rows[0].id,
    });

    expect(secondResponse.status).toBe(409);

    const bookings = await pool.query(
      "SELECT * FROM bookings WHERE slot_id = $1",
      [firstSlot.rows[0].id],
    );

    expect(bookings.rowCount).toBe(1);

    const result = await pool.query(
      "SELECT credits FROM clients WHERE id = $1",
      [firstClient.rows[0].id],
    );

    expect(result.rows[0].credits).toBe(firstClientCredits - 100);
  });

  it("10. should prevent overspending balance during concurrent requests", async () => {
    const responses = await Promise.all([
      request(app).post("/api/bookings").send({
        clientId: thirdClient.rows[0].id,
        expertId: expert.rows[0].id,
        slotId: firstSlot.rows[0].id,
      }),
      request(app).post("/api/bookings").send({
        clientId: thirdClient.rows[0].id,
        expertId: expert.rows[0].id,
        slotId: secondSlot.rows[0].id,
      }),
    ]);

    const successfulResponses = responses.filter(
      (response) => response.status === 201,
    );

    expect(successfulResponses.length).toBe(1);

    const bookings = await pool.query(
      "SELECT * FROM bookings WHERE client_id = $1",
      [thirdClient.rows[0].id],
    );

    expect(bookings.rowCount).toBe(1);

    const client = await pool.query(
      "SELECT credits FROM clients WHERE id = $1",
      [thirdClient.rows[0].id],
    );

    expect(client.rows[0].credits).toBe(thirdClientCredits - 100);
  });
});

afterAll(async () => {
  await pool.query("DELETE FROM bookings WHERE slot_id IN ($1, $2)", [
    firstSlot.rows[0].id,
    secondSlot.rows[0].id,
  ]);

  await pool.query("DELETE FROM slots WHERE id IN ($1, $2)", [
    firstSlot.rows[0].id,
    secondSlot.rows[0].id,
  ]);

  await pool.query("DELETE FROM experts WHERE id = $1", [expert.rows[0].id]);

  await pool.query("DELETE FROM clients WHERE id = $1", [
    firstClient.rows[0].id,
  ]);

  await pool.query("DELETE FROM clients WHERE id = $1", [
    secondClient.rows[0].id,
  ]);

  await pool.query("DELETE FROM clients WHERE id = $1", [
    thirdClient.rows[0].id,
  ]);

  await pool.end();
});
