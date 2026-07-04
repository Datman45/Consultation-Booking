import { IDomain } from "./IDomain";

export interface IBooking extends IDomain {
  clientId: string;
  expertId: string;
  slotId: string;
}
