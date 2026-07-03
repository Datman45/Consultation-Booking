import { expertDao } from ".";
import { pool } from "../../db/coonection";
import { Expert } from "../../types";

export class PostgresExpertDao implements expertDao {
  async getAllExperts(): Promise<Expert[]> {
    const result = await pool.query("SELECT * FROM experts");

    return result.rows;
  }
}
