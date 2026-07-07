export interface Booking {
  id: string;
  clientId: string;
  expertId: string;
  slotId: string;
  status: string;
  createdAt: Date;
}

export interface CreateBooking {
  clientId: string;
  expertId: string;
  slotId: string;
  status: string;
  createdAt: Date;
}

export interface CreateBookingRequestBody {
  clientId: string;
  expertId: string;
  slotId: string;
}
