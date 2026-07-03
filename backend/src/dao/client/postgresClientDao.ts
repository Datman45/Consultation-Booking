import { ClientDao } from ".";
import { Client } from "../../types";
import { pool } from "../../db/coonection";

export class PostgresClientDao implements ClientDao {
  async getAllClient(): Promise<Client[]> {
    const result = await pool.query("SELECT * FROM clients");

    return result.rows;
  }

  async getClientById(id: string): Promise<Client> {
    const result = await pool.query("SELECT * FROM clients where id = $1", [
      id,
    ]);

    return result.rows[0];
  }
  async updateClientCredits(id: string, credits: number): Promise<void> {
    await pool.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      credits,
      id,
    ]);
  }
}
