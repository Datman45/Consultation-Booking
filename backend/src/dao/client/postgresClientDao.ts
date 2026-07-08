import { ClientDao } from ".";
import { Client } from "../../types";
import { pool } from "../../db/coonection";
import { PoolClient } from "pg";

export class PostgresClientDao implements ClientDao {
  async getAllClient(): Promise<Client[]> {
    const result = await pool.query("SELECT * FROM clients");

    return result.rows;
  }

  async getClientById(id: string): Promise<Client | undefined> {
    const result = await pool.query("SELECT * FROM clients WHERE id = $1", [
      id,
    ]);

    return result.rows[0];
  }

  async getClientByIdForUpdate(
    id: string,
    dbClient: PoolClient,
  ): Promise<Client> {
    const result = await dbClient.query(
      "SELECT * FROM clients WHERE id = $1 FOR UPDATE",
      [id],
    );

    return result.rows[0];
  }

  async updateClientCredits(
    id: string,
    credits: number,
    dbClient: PoolClient,
  ): Promise<void> {
    await dbClient.query("UPDATE clients SET credits = $1 WHERE id = $2", [
      credits,
      id,
    ]);
  }
}
