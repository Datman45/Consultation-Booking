import { pool } from "./coonection";
import fs from "fs/promises";

async function initDb() {
  const sql = await fs.readFile("sql/schemas.sql", "utf-8");

  await pool.query(sql);

  await assignExpertsToSlots();

  console.log("Database initialized successfully");
}

async function assignExpertsToSlots() {
  await pool.query("DELETE FROM slots");

  const expertsResult = await pool.query("SELECT id FROM experts");
  const experts = expertsResult.rows;

  for (const expert of experts) {
    let count = 0;
    while (count < 2) {
      await insertExpertsToSlots(expert);
      count++;
    }
  }
}

async function insertExpertsToSlots(expert: any) {
  await pool.query(`INSERT INTO slots (expert_id, date) values ($1, $2)`, [
    expert.id,
    new Date(),
  ]);
}

initDb().catch((err) => {
  console.error("Error initializing database:", err);
});
