import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./libs/socket.js";
import path from "path";

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
const PORT = process.env.PORT || 8081;
const __dirname = path.resolve();

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../chat-ui/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../chat-ui", "dist", "index.html"));
  });
}
server.listen(PORT, () => {
  console.log(`Chat api is running on ${PORT}`);
  connectDB();
});
