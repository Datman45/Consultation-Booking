import { app } from "./app";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
