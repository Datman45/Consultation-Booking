import { IDomain } from "./IDomain";

export interface IBooking extends IDomain {
  clientId: string;
  expertId: string;
  slotId: string;
}

export interface IBookingResponse extends IDomain {
  clientId?: string;
  expertId?: string;
  slotId?: string;
  status?: string;
  createdAt?: string;
}
