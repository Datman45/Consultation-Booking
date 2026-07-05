import { createBookingRequestBody } from "../../src/types/booking";
import { Request, Response, NextFunction } from "express";

export function validateBookingRequestBody(
  req: Request<{}, any, createBookingRequestBody>,
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
export function validateBookingUUID(
  req: Request<{ id: string }, any, string>,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid bookingId format" });
  }

  next();
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(uuid);
}
