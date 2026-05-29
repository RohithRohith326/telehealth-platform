/**
 * Application configuration loaded from environment variables.
 * Used across routes and services for LiveKit and server settings.
 */
export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  livekit: {
    apiKey: process.env.LIVEKIT_API_KEY || "demo_key",
    // Support both LIVEKIT_SECRET and LIVEKIT_API_SECRET for compatibility
    secret: process.env.LIVEKIT_API_SECRET || process.env.LIVEKIT_SECRET || "demo_secret",
    url: process.env.LIVEKIT_URL || "wss://demo.livekit.cloud",
    /** HTTPS URL for LiveKit API (server SDK uses HTTP) */
    get apiUrl() {
      return this.url.replace("wss://", "https://").replace("ws://", "http://");
    },
  },
  /** Path for audit log file */
  auditLogPath: process.env.AUDIT_LOG_PATH || "audit.log",
};
