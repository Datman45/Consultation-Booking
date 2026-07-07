import { PoolClient } from "pg";
import { BookingDao } from ".";
import { pool } from "../../db/coonection";
import { Booking, CreateBookingRequestBody } from "../../types";

export class PostgresBookingDao implements BookingDao {
  async createBooking(
    bookingData: CreateBookingRequestBody,
    dbClient: PoolClient,
  ): Promise<Booking> {
    const result = await dbClient.query(
      "INSERT INTO bookings (client_id, expert_id, slot_id) VALUES ($1, $2, $3) RETURNING *",
      [bookingData.clientId, bookingData.expertId, bookingData.slotId],
    );
    return mapToBooking(result.rows[0]);
  }
  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      bookingId,
    ]);

    if (!result.rows[0]) {
      return undefined;
    }

    return mapToBooking(result.rows[0]);
  }

  async getBookingBySlotId(
    slotId: string,
    dbClient: PoolClient,
  ): Promise<Booking | undefined> {
    const result = await dbClient.query(
      "SELECT * FROM bookings WHERE slot_id = $1",
      [slotId],
    );

    if (!result.rows[0]) {
      return undefined;
    }

    return mapToBooking(result.rows[0]);
  }
}

function mapToBooking(data: any): Booking {
  return {
    id: data.id,
    clientId: data.client_id,
    expertId: data.expert_id,
    slotId: data.slot_id,
    status: data.status,
    createdAt: data.created_at,
  };
}
