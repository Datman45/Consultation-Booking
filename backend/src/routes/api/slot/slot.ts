import { Router } from "express";
import { PostgresSlotDao } from "../../../dao";

export const router = Router();
const postgresExpertDao = new PostgresSlotDao();

router.get("/", async (req, res) => {
  const result = await postgresExpertDao.getAllSlots();
  res.send(result);
});
