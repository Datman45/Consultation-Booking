import { PoolClient } from "pg";
import { CreateBooking, Booking } from "../../types";

export interface BookingDao {
  createBooking(
    bookingData: CreateBooking,
    dbClient: PoolClient,
  ): Promise<Booking>;
  getBookingById(bookingId: string): Promise<Booking | undefined>;
  getBookingBySlotId(
    slotId: string,
    dbClient: PoolClient,
  ): Promise<Booking | undefined>;
}

export * from "./postgresBookingDao";
