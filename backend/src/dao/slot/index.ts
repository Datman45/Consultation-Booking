import { PoolClient } from "pg";
import { Slot } from "../../types";

export interface SlotDao {
  getAllSlots(): Promise<Slot[]>;
  getSlotById(id: string, dbClient: PoolClient): Promise<Slot>;
}

export * from "./postgresSlotDao";
