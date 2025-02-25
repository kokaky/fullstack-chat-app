import express from "express";
import { AccessToken } from "livekit-server-sdk";

const router = express.Router();

const createToken = async (room, fullName) => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  const roomName = room;
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK
  const participantName = fullName;

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return "500";
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: "10m",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
};

router.get("/getToken/", async (req, res) => {
  try {
    const { room, fullName } = req.query;
    console.log("room", room);

    if (!room || !fullName) {
      res.status(400).json({ error: "缺少参数,请稍后再试！" });
    }

    const result = await createToken(room, fullName);

    if (result === "500") {
      res.status(500).json("获取apiKey或者apiValue出错,请稍后再试!");
    }

    res.status(200).json({ accessToken: result });
  } catch (error) {}
});

export default router;
