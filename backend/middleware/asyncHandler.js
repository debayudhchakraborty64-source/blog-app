/**
 * Wraps async route handlers so any rejected promise
 * is forwarded to Express' error middleware (next(err)).
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
