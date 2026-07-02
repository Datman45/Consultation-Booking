import { Router } from "express";
import { Request } from "express";
import { createBookingRequestBody } from "../../../types";
import { PostgresBookingDao } from "../../../dao/booking/postgresBookingDao";
import { validateBookingRequestBody } from "../../../middlewares/booking";

export const router = Router();
const postgresBookingDao =
  new (PostgresBookingDao as any)() as PostgresBookingDao;

router.post(
  "/",
  validateBookingRequestBody,
  async (req: Request<{}, any, createBookingRequestBody>, res) => {
    const { clientId, expertId, slotId } = req.body;
    const booking = await postgresBookingDao.createBooking({
      client_id: clientId,
      expert_id: expertId,
      slot_id: slotId,
      created_at: new Date(),
    });

    res.send(booking);
  },
);

router.get("/", (req, res) => {
  res.json([
    { bookingId: 1, clientId: 1, expertId: 1, slotId: 1 },
    { bookingId: 2, clientId: 2, expertId: 2, slotId: 2 },
  ]);
});

router.get("/:id", async (req, res) => {
  const bookingId = req.params.id;
  const booking = await postgresBookingDao.getBookingById(bookingId);

  console.log("Booking retrieved:", booking);

  res.send(booking);
});
