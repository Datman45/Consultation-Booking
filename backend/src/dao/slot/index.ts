import { Slot } from "../../types";

export interface SlotDao {
  getSlotById(id: string): Promise<Slot>;
}

export * from "./postgresSlotDao";
