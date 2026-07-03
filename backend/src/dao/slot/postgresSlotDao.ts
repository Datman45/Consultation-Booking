import { SlotDao } from ".";
import { pool } from "../../db/coonection";
import { Slot } from "../../types";

export class PostgresSlotDao implements SlotDao {
  async getAllSlots(): Promise<Slot[]> {
    const result = await pool.query("SELECT * FROM slots");

    return result.rows;
  }

  async getSlotById(id: string): Promise<Slot> {
    const result = await pool.query("SELECT * FROM slots WHERE id = $1", [id]);

    return result.rows[0];
  }
}
