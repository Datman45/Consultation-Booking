import { PoolClient } from "pg";
import { BookingDao } from ".";
import { pool } from "../../db/coonection";
import { Booking } from "../../types";

export class PostgresBookingDao implements BookingDao {
  async createBooking(
    bookingData: Booking,
    dbClient: PoolClient,
  ): Promise<Booking> {
    const result = await dbClient.query(
      "INSERT INTO bookings (client_id, expert_id, slot_id, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        bookingData.clientId,
        bookingData.expertId,
        bookingData.slotId,
        bookingData.status,
        bookingData.createdAt,
      ],
    );
    return result.rows[0];
  }
  async getBookingById(bookingId: string): Promise<Booking> {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      bookingId,
    ]);

    return result.rows[0];
  }

  async getBookingBySlotId(slotId: string): Promise<Booking> {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE slot_id = $1",
      [slotId],
    );

    return result.rows[0];
  }
}
