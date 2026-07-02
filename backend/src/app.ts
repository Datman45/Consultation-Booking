import express from "express";
import { bookingRouter } from "./routes/index";
import { pool } from "./db/coonection";

console.log("App is starting...");

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

app.use(express.json());

app.use("/api/booking", bookingRouter);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
