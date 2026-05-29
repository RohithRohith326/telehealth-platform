/**
 * Entry point: load .env from backend folder first, then start the server.
 * Ensures LIVEKIT_* are set before config and routes run.
 * Always start the backend with: npm start  (or node run.js)
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn("Could not load .env from", envPath, result.error.message);
}
if (!process.env.LIVEKIT_URL) {
  console.warn("LIVEKIT_URL is not set. Add LIVEKIT_URL=ws://127.0.0.1:7880 (or your server) to backend/.env");
}

await import("./server.js");
