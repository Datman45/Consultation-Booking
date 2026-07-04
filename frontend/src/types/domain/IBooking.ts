import { IDomain } from "./IDomain";

export interface IBooking extends IDomain {
  clientId: string;
  expertId: string;
  slotId: string;
}

export interface IBooking2 extends IDomain {
  client_id?: string;
  expert_id?: string;
  slot_id?: string;
  status?: string;
  created_at?: string;
}
