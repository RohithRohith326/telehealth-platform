/**
 * Auth routes - token generation for joining LiveKit rooms.
 * Uses LIVEKIT_API_KEY and LIVEKIT_API_SECRET from environment.
 */
import { Router } from "express";
import { AccessToken } from "livekit-server-sdk";
import { config } from "../config/index.js";
import { appendAudit } from "../utils/audit.js";

const router = Router();

/** Use 127.0.0.1 instead of localhost so the browser hits IPv4 (avoids ::1 vs 127.0.0.1 issues). */
function preferIpv4Loopback(url) {
  if (typeof url !== "string") return url;
  return url
    .replace(/^ws:\/\/localhost\b/, "ws://127.0.0.1")
    .replace(/^wss:\/\/localhost\b/, "wss://127.0.0.1");
}

/**
 * GET /getToken
 * Query: room (room name), name (participant identity), role (optional: host | viewer)
 * Returns: { token, url } so the client connects to YOUR LiveKit server (from LIVEKIT_URL), not demo.
 * Token grants: join room, publish video/audio, subscribe to others.
 */
router.get("/getToken", async (req, res, next) => {
  try {
    const room = req.query.room;
    const name = req.query.name;
    const role = req.query.role;

    if (!room || !name) {
      return res.status(400).json({
        error: "Missing required query parameters: room and name are required.",
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY || config.livekit.apiKey;
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.LIVEKIT_SECRET || config.livekit.secret;
    // Must use LIVEKIT_URL from .env so client connects to your server (e.g. ws://127.0.0.1:7880), not demo.livekit.cloud
    const livekitUrl = process.env.LIVEKIT_URL || config.livekit.url;
    if (!process.env.LIVEKIT_URL && livekitUrl.includes("demo.livekit.cloud")) {
      console.warn("[getToken] LIVEKIT_URL not set — returning demo URL. Set LIVEKIT_URL in backend/.env and start with: npm start");
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: name });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    appendAudit({ event: "JOIN", name, room, role: role || "host", ts: new Date() });

    res.json({ token, url: preferIpv4Loopback(livekitUrl) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /getToken
 * Body: { room, username }
 * Same as GET /getToken but for JSON body; returns { token, url }.
 */
router.post("/getToken", async (req, res, next) => {
  try {
    const { room, username } = req.body;
    const name = username || req.body.name;

    if (!room || !name) {
      return res.status(400).json({
        error: "Missing required body fields: room and username (or name) are required.",
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY || config.livekit.apiKey;
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.LIVEKIT_SECRET || config.livekit.secret;
    const livekitUrl = process.env.LIVEKIT_URL || config.livekit.url;

    const at = new AccessToken(apiKey, apiSecret, { identity: name });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    appendAudit({ event: "JOIN", name, room, ts: new Date() });

    res.json({ token, url: preferIpv4Loopback(livekitUrl) });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /token
 * Legacy endpoint - same as /getToken (query: name, room, role).
 */
router.get("/token", async (req, res, next) => {
  try {
    const { name, room, role } = req.query;

    if (!name || !room) {
      return res.status(400).json({
        error: "Missing required query parameters: name and room are required.",
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY || config.livekit.apiKey;
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.LIVEKIT_SECRET || config.livekit.secret;
    const livekitUrl = process.env.LIVEKIT_URL || config.livekit.url;

    const at = new AccessToken(apiKey, apiSecret, { identity: String(name) });
    at.addGrant({
      roomJoin: true,
      room: String(room),
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    appendAudit({ event: "JOIN", name, room, role: role || "host", ts: new Date() });
    res.json({ token, url: preferIpv4Loopback(livekitUrl) });
  } catch (err) {
    next(err);
  }
});

export default router;
