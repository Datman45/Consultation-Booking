import { IClient } from "../types";
import { EntityService } from "./EntityService";

export class ClientService extends EntityService<IClient> {
  constructor() {
    super("/client");
  }
}
