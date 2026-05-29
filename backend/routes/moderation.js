/**
 * Moderation routes - kick/remove participant from a room.
 */
import { Router } from "express";
import { roomService } from "../services/livekit.js";

const router = Router();

/**
 * POST /moderate/kick
 * Body: { room: string, identity: string }
 * Removes the participant with the given identity from the room.
 */
router.post("/moderate/kick", async (req, res, next) => {
  try {
    const { room, identity } = req.body;

    if (!room || !identity) {
      return res.status(400).json({
        error: "Missing required body fields: room and identity.",
      });
    }

    await roomService.removeParticipant(room, identity);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
