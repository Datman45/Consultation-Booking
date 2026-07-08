import { PoolClient } from "pg";
import { Client } from "../../types";

export interface ClientDao {
  getAllClient(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | undefined>;
  getClientByIdForUpdate(id: string, dbClient: PoolClient): Promise<Client>;
  updateClientCredits(
    id: string,
    credits: number,
    dbClient: PoolClient,
  ): Promise<void>;
}

export * from "./postgresClientDao";
