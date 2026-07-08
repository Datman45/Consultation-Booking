import { Request, Response, NextFunction } from "express";

export function validateUUID(
  req: Request<{ id: string }, any, string>,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid id format" });
  }

  next();
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(uuid);
}
