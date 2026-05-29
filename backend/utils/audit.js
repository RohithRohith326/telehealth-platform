/**
 * Audit logging utility - appends JSON events to the audit log file.
 */
import fs from "fs";
import { config } from "../config/index.js";

export function appendAudit(entry) {
  try {
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(config.auditLogPath, line);
  } catch (err) {
    console.error("[AUDIT] Failed to write audit log:", err.message);
  }
}
