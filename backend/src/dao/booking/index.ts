import { createBookingRequestBody, Booking } from "../../types/booking";

export interface BookingDao {
  createBooking(bookingData: createBookingRequestBody): Promise<Booking>;
  getBookingById(bookingId: string): Promise<Booking>;
}
