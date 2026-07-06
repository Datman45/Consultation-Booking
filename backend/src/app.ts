import express from "express";
import {
  bookingRouter,
  clientRouter,
  expertRouter,
  slotRouter,
} from "./routes/index";
import cors from "cors";

console.log("App is starting...");

export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
  }),
);

app.use("/api/booking", bookingRouter);
app.use("/api/client", clientRouter);
app.use("/api/expert", expertRouter);
app.use("/api/slot", slotRouter);
