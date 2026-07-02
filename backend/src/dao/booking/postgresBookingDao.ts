import { BookingDao } from ".";
import { pool } from "../../db/coonection";

export class PostgresBookingDao implements BookingDao {
  async createBooking(bookingData: any): Promise<any> {
    const result = await pool.query(
      "INSERT INTO bookings (client_id, expert_id, slot_id, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        bookingData.client_id,
        bookingData.expert_id,
        bookingData.slot_id,
        bookingData.status,
        bookingData.created_at,
      ],
    );
    return result.rows[0];
  }
  async getBookingById(bookingId: string): Promise<any> {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      bookingId,
    ]);

    return result.rows[0];
  }
}
