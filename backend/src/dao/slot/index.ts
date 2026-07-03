import { Slot } from "../../types";

export interface SlotDao {
  getAllSlots(): Promise<Slot[]>;
  getSlotById(id: string): Promise<Slot>;
}

export * from "./postgresSlotDao";
