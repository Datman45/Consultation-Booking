export interface BookingDao {
  createBooking(bookingData: any): Promise<any>;
  getBookingById(bookingId: string): Promise<any>;
}
