import { Router } from "express";
import { PostgresClientDao } from "../../../dao";

export const router = Router();
const postgresClientDao = new PostgresClientDao();

router.get("/", async (req, res) => {
  const result = await postgresClientDao.getAllClient();
  res.send(result);
});
