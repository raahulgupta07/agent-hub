// In-memory login rate limiter (per client IP). Single-instance only — fine for
// this deployment. Blocks brute-force on /login.
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILS = 8;

const attempts = new Map(); // ip -> { count, resetAt }

export function isBlocked(ip) {
  const e = attempts.get(ip);
  if (!e) return false;
  if (Date.now() >= e.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return e.count >= MAX_FAILS;
}

export function recordFail(ip) {
  const now = Date.now();
  let e = attempts.get(ip);
  if (!e || now >= e.resetAt) e = { count: 0, resetAt: now + WINDOW_MS };
  e.count += 1;
  attempts.set(ip, e);
}

export function clearAttempts(ip) {
  attempts.delete(ip);
}
