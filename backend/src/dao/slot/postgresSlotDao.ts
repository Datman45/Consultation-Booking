import { SlotDao } from ".";
import { pool } from "../../db/coonection";
import { Slot } from "../../types";

export class postgresSlotDao implements SlotDao {
  async getSlotById(id: string): Promise<Slot> {
    const result = await pool.query("SELECT * FROM slots WHERE id = $1", [id]);

    return result.rows[0];
  }
}
