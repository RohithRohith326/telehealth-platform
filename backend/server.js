/**
 * Telehealth platform backend - entry point.
 * Started via run.js so .env is loaded first; LIVEKIT_* are then available.
 * Mounts auth, streaming, moderation, and audit routes.
 */
import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import streamingRoutes from "./routes/streaming.js";
import moderationRoutes from "./routes/moderation.js";
import auditRoutes from "./routes/audit.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// --- Routes ---
app.use("/", authRoutes);       // GET /token
app.use("/stream", streamingRoutes);   // POST /stream/rtmp, POST /stream/record
app.use("/moderate", moderationRoutes); // POST /moderate/kick
app.use("/audit", auditRoutes);  // POST /audit

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(config.port, () => {
  const livekitUrl = process.env.LIVEKIT_URL || config.livekit.url;
  console.log(`Telehealth backend running on port ${config.port}`);
  console.log(`LIVEKIT_URL=${livekitUrl} (client will connect here; must match your LiveKit server)`);
  if (!process.env.LIVEKIT_URL) {
    console.warn("LIVEKIT_URL not set in .env — using default. Start with 'npm start' from backend folder so .env is loaded.");
  }
});
