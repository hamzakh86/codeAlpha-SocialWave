const rateLimit = require("express-rate-limit");
const MESSAGE = "Too many requests, please try again later.";

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || req.headers["x-forwarded-for"] || "unknown",
  });
};

const configLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
const logLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
const createPostLimiter = createLimiter(5 * 60 * 1000, 20, MESSAGE);
const likeSaveLimiter = createLimiter(10 * 60 * 1000, 250, MESSAGE);
const followLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
const signUpSignInLimiter = createLimiter(10 * 60 * 1000, 500, MESSAGE); // ✅ 100 → 500
const commentLimiter = createLimiter(5 * 60 * 1000, 100, MESSAGE);

module.exports = {
  configLimiter,
  logLimiter,
  createPostLimiter,
  likeSaveLimiter,
  followLimiter,
  signUpSignInLimiter,
  commentLimiter,
};
