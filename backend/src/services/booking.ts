import { BookingDao, ClientDao } from "../dao";
import { pool } from "../db/coonection";
import { Booking, CreateBookingRequestBody } from "../types";

export class BookingService {
  private bookingDao: BookingDao;
  private clientDao: ClientDao;

  constructor(bookingDao: BookingDao, clientDao: ClientDao) {
    this.bookingDao = bookingDao;
    this.clientDao = clientDao;
  }

  async createBooking(bookingData: CreateBookingRequestBody): Promise<Booking> {
    const dbClient = await pool.connect();

    try {
      await dbClient.query("BEGIN");

      const client = await this.clientDao.getClientByIdForUpdate(
        bookingData.clientId,
        dbClient,
      );

      if (Number(client.credits) < 100) {
        throw new Error("Client does not have enough credits");
      }

      const bookedSlot = await this.bookingDao.getBookingBySlotId(
        bookingData.slotId,
        dbClient,
      );

      if (bookedSlot) {
        throw new Error("Slot is already booked");
      }

      const booking = await this.bookingDao.createBooking(
        bookingData,
        dbClient,
      );

      await this.clientDao.updateClientCredits(
        bookingData.clientId,
        Number(client.credits) - 100,
        dbClient,
      );

      await dbClient.query("COMMIT");

      return booking;
    } catch (error: any) {
      await dbClient.query("ROLLBACK");

      if (error.code === "23505") {
        throw new Error("Slot is already booked");
      }

      throw error;
    } finally {
      dbClient.release();
    }
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await this.bookingDao.getBookingById(bookingId);

    if (!booking) {
      throw new Error(`Booking with ${bookingId} doesn't exist`);
    }

    return booking;
  }
}
