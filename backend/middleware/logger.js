/**
 * Request logging middleware.
 * Logs method, path, and timestamp for each request to stdout.
 */
export function requestLogger(req, res, next) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.path}`);
  next();
}
