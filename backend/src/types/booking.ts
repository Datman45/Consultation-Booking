export interface Booking {
  clientId: string;
  expertId: string;
  slotId: string;
  status: string;
  createdAt: string;
}

export interface createBookingRequestBody {
  clientId: string;
  expertId: string;
  slotId: string;
}
