import { createBookingRequestBody, Booking } from "../../types";

export interface BookingDao {
  createBooking(bookingData: createBookingRequestBody): Promise<Booking>;
  getBookingById(bookingId: string): Promise<Booking>;
  getBookingBySlotId(slotId: string): Promise<Booking>;
}

export * from "./postgresBookingDao";
