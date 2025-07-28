import express from "express";
import { chatHandler } from "./api/chat/handler";

const app = express();
app.use(express.json());
app.post("/api/chat", chatHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
