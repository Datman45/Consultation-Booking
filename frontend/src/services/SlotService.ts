import { ISlot } from "../types/domain/ISlot";
import { EntityService } from "./EntityService";

export class SlotService extends EntityService<ISlot> {
  constructor() {
    super("/slot");
  }
}
