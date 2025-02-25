import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import { getRoomId, removeRoomId } from "../controllers/room_contorller.js";

const router = express.Router();

router.get("/:roomId", protectRoute, getRoomId);
router.delete("/:roomId", protectRoute, removeRoomId);

export default router;
