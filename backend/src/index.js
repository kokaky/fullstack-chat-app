// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

import authRoutes from "./routes/auth_route.js";
import messageRoutes from "./routes/message_route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const createToken = async () => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  const roomName = "quickstart-room";
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK
  const participantName = "quickstart-username";

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      // Token to expire after 10 minutes
      ttl: "10m",
    }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};

// 方便使用json
app.use(express.json());
// 方便使用cookie的解析
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/livekit/getToken", async (req, res) => {
  res.send(await createToken());
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port:${PORT} !`);
  connectDB();
});
