import { Router } from "express";
import { PostgresClientDao } from "../../../dao";
import { validateUUID } from "../../../middlewares/uuid";

export const router = Router();
const postgresClientDao = new PostgresClientDao();

router.get("/", async (req, res) => {
  const result = await postgresClientDao.getAllClient();
  return res.json(result);
});

router.get("/:id", validateUUID, async (req, res) => {
  const result = await postgresClientDao.getClientById(req.params.id);

  if (!result) {
    return res.status(404).json({ error: "Client not found" });
  }

  return res.json(result);
});
