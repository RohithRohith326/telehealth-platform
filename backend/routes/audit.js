/**
 * Audit routes - append custom audit events from the client.
 */
import { Router } from "express";
import { appendAudit } from "../utils/audit.js";

const router = Router();

/**
 * POST /audit
 * Body: any JSON object (event payload)
 * Appends the payload to the audit log.
 */
router.post("/audit", (req, res, next) => {
  try {
    appendAudit(req.body);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
