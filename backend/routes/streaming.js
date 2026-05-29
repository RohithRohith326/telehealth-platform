/**
 * Streaming routes - RTMP output and room recording.
 * Uses LiveKit Egress (Room Composite) to stream or record the room.
 */
import { Router } from "express";
import { roomService } from "../services/livekit.js";

const router = Router();

/**
 * POST /stream/rtmp
 * Body: { room: string, rtmpUrl: string }
 * Starts RTMP egress to the given URL (e.g. YouTube, CDN). Returns egressId.
 */
router.post("/stream/rtmp", async (req, res, next) => {
  try {
    const { room, rtmpUrl } = req.body;

    if (!room || !rtmpUrl) {
      return res.status(400).json({
        error: "Missing required body fields: room and rtmpUrl.",
      });
    }

    const egress = await roomService.startRoomCompositeEgress(room, {
      rtmp: { urls: [rtmpUrl] },
    });

    res.json({ egressId: egress.egressId });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /stream/record
 * Body: { room: string }
 * Starts room composite recording to file. Returns egressId.
 */
router.post("/stream/record", async (req, res, next) => {
  try {
    const { room } = req.body;

    if (!room) {
      return res.status(400).json({
        error: "Missing required body field: room.",
      });
    }

    const filepath = `/streams/${room}-${Date.now()}.mp4`;
    const egress = await roomService.startRoomCompositeEgress(room, {
      file: { filepath },
    });

    res.json({ egressId: egress.egressId });
  } catch (err) {
    next(err);
  }
});

export default router;
