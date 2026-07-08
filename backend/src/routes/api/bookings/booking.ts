import { Router } from "express";
import { Request } from "express";
import { CreateBookingRequestBody } from "../../../types";
import {
  BookingDao,
  ClientDao,
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

      res.status(201).send(booking);
    } catch (error) {
      const message = (error as Error).message;

      if (message === "Slot is already booked") {
        return res.status(409).json({ error: message });
      }

      if (message === "Client does not have enough credits") {
        return res.status(403).json({ error: message });
      }

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
