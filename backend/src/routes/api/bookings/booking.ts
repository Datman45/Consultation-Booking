import { Router } from "express";
import { Request } from "express";
import { CreateBookingRequestBody } from "../../../types";
import {
  BookingDao,
  ClientDao,
  PostgresClientDao,
  PostgresBookingDao,
} from "../../../dao/";
import { validateBookingRequestBody } from "../../../middlewares/booking";
import { BookingService } from "../../../services/booking";
import { validateUUID } from "../../../middlewares/uuid";

export const router = Router();
const clientDao: ClientDao = new PostgresClientDao();
const bookingDao: BookingDao = new PostgresBookingDao();
const bookingService = new BookingService(bookingDao, clientDao);

router.post(
  "/",
  validateBookingRequestBody,
  async (req: Request<{}, any, CreateBookingRequestBody>, res) => {
    try {
      const { clientId, expertId, slotId } = req.body;
      const booking = await bookingService.createBooking({
        clientId: clientId,
        expertId: expertId,
        slotId: slotId,
      });

      return res.status(201).json(booking);
    } catch (error) {
      const message = (error as Error).message;

      if (message === "Slot is already booked") {
        return res.status(409).json({ error: message });
      }

      if (message === "Client does not have enough credits") {
        return res.status(403).json({ error: message });
      }

      return res.status(400).json({ error: message });
    }
  },
);

router.get("/:id", validateUUID, async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    return res.json(booking);
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});
