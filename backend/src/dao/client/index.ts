import { Client } from "../../types";

export interface ClientDao {
  getAllClient(): Promise<Client[]>;
  getClientById(id: string): Promise<Client>;
  updateClientCredits(id: string, credits: number): Promise<void>;
}

export * from "./postgresClientDao";
