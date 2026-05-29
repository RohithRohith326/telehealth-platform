/**
 * Global error handler middleware.
 * Catches errors from route handlers and returns a consistent JSON error response.
 */
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  console.error(`[ERROR] ${req.method} ${req.path}`, err);
  res.status(status).json({ error: message });
}
