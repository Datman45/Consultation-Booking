import { PoolClient } from "pg";
import { Booking, CreateBookingRequestBody } from "../../types";

export interface BookingDao {
  createBooking(
    bookingData: CreateBookingRequestBody,
    dbClient: PoolClient,
  ): Promise<Booking>;
  getBookingById(bookingId: string): Promise<Booking | undefined>;
  getBookingBySlotId(
    slotId: string,
    dbClient: PoolClient,
  ): Promise<Booking | undefined>;
}

export * from "./postgresBookingDao";
