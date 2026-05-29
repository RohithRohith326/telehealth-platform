/**
 * LiveKit service - RoomServiceClient for server-side room operations.
 * Used for: starting RTMP egress, recording, and removing participants.
 */
import { RoomServiceClient } from "livekit-server-sdk";
import { config } from "../config/index.js";

const roomService = new RoomServiceClient(
  config.livekit.apiUrl,
  config.livekit.apiKey,
  config.livekit.secret
);

export { roomService };
