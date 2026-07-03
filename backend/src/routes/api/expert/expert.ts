import { Router } from "express";
import { PostgresExpertDao } from "../../../dao";

export const router = Router();
const postgresExpertDao = new PostgresExpertDao();

router.get("/", async (req, res) => {
  const result = await postgresExpertDao.getAllExperts();
  res.send(result);
});
