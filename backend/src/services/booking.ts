import { BookingDao, ClientDao, SlotDao } from "../dao";
import { pool } from "../db/coonection";
import { Booking } from "../types";

export class BookingService {
  private bookingDao: BookingDao;
  private clientDao: ClientDao;
  private slotDao: SlotDao;

  constructor(bookingDao: BookingDao, clientDao: ClientDao, slotDao: SlotDao) {
    this.bookingDao = bookingDao;
    this.clientDao = clientDao;
    this.slotDao = slotDao;
  }

  async createBooking(bookingData: Booking): Promise<Booking> {
    const busySlot = await this.bookingDao.getBookingBySlotId(
      bookingData.slotId,
    );

    if (busySlot) {
      throw new Error("Slot is already booked");
    }

    const client = await this.clientDao.getClientById(bookingData.clientId);

    if (Number(client.credits) < 100) {
      throw new Error("Client does not have enough credits");
    }

    const booking = await this.bookingDao.createBooking(bookingData);

    await this.clientDao.updateClientCredits(
      bookingData.clientId,
      Number(client.credits) - 100,
    );
    return booking;
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await this.bookingDao.getBookingById(bookingId);

    if (!booking) {
      throw new Error(`Booking with ${bookingId} doesn't exist`);
    }

    return booking;
  }
}
