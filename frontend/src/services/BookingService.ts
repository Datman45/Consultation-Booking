import { IBooking } from "../types/";
import { EntityService } from "./EntityService";

export class BookingService extends EntityService<IBooking> {
  constructor() {
    super("/bookings");
  }
}
