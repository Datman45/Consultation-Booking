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
import {
  validateBookingRequestBody,
  validateBookingUUID,
} from "../../../middlewares/booking";
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

router.get("/:id", validateBookingUUID, async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.send(booking);
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});
