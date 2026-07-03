import { Client } from "../../types";

export interface ClientDao {
  getClientById(id: string): Promise<Client>;
  updateClientCredits(id: string, credits: number): Promise<void>;
}

export * from "./postgresClientDao";
