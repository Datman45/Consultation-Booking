import { PoolClient } from "pg";
import { Slot } from "../../types";

export interface SlotDao {
  getAllSlots(): Promise<Slot[]>;
}

export * from "./postgresSlotDao";
