import { Router } from "express";
import { Request } from "express";
import { createBookingRequestBody } from "../../../types";
import {
  BookingDao,
  ClientDao,
  PostgresSlotDao,
  SlotDao,
  PostgresClientDao,
  PostgresBookingDao,
} from "../../../dao/";
import { validateBookingRequestBody } from "../../../middlewares/booking";
import { BookingService } from "../../../services/booking";

export const router = Router();
const clientDao: ClientDao = new PostgresClientDao();
const bookingDao: BookingDao = new PostgresBookingDao();
const slotDao: SlotDao = new PostgresSlotDao();
const bookingService = new BookingService(bookingDao, clientDao, slotDao);

router.post(
  "/",
  validateBookingRequestBody,
  async (req: Request<{}, any, createBookingRequestBody>, res) => {
    try {
      const { clientId, expertId, slotId } = req.body;
      const booking = await bookingService.createBooking({
        clientId: clientId,
        expertId: expertId,
        slotId: slotId,
        status: "pending",
        createdAt: new Date(),
      });

      res.send(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

router.get("/:id", async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  res.send(booking);
});
