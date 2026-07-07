import { PoolClient } from "pg";
import { SlotDao } from ".";
import { pool } from "../../db/coonection";
import { Slot } from "../../types";

export class PostgresSlotDao implements SlotDao {
  async getAllSlots(): Promise<Slot[]> {
    const result = await pool.query(
      "SELECT s.id, s.expert_id, s.date, e.first_name, e.last_name FROM slots s JOIN experts e ON (s.expert_id = e.id)",
    );

    return result.rows;
  }

  async getSlotById(id: string, dbClient: PoolClient): Promise<Slot> {
    const result = await dbClient.query("SELECT * FROM slots WHERE id = $1", [
      id,
    ]);

    return result.rows[0];
  }
}
