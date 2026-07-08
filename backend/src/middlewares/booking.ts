import { CreateBookingRequestBody } from "../../src/types/booking";
import { Request, Response, NextFunction } from "express";
import { isValidUUID } from "./uuid";

export function validateBookingRequestBody(
  req: Request<{}, any, CreateBookingRequestBody>,
  res: Response,
  next: NextFunction,
) {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const { clientId, expertId, slotId } = req.body;

  if (!clientId || typeof clientId !== "string") {
    return res.status(400).json({ error: "Invalid or missing clientId" });
  }

  if (!expertId || typeof expertId !== "string") {
    return res.status(400).json({ error: "Invalid or missing expertId" });
  }

  if (!slotId || typeof slotId !== "string") {
    return res.status(400).json({ error: "Invalid or missing slotId" });
  }

  if (!isValidUUID(clientId)) {
    return res.status(400).json({ error: "Invalid clientId format" });
  }

  if (!isValidUUID(expertId)) {
    return res.status(400).json({ error: "Invalid expertId format" });
  }

  if (!isValidUUID(slotId)) {
    return res.status(400).json({ error: "Invalid slotId format" });
  }

  next();
}
