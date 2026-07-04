import { IDomain } from "./IDomain";

export interface ISlot extends IDomain {
  expert_id: string;
  date: Date;
  first_name: string;
  last_name: string;
}
