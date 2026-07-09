import crypto from 'node:crypto';
import { env } from '$env/dynamic/private';

const COOKIE = 'cah_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  return env.SESSION_SECRET || 'dev-insecure-secret-change-me';
}

// Signed, stateless session token: base64url(payload).hmac
export function createToken(email) {
  const payload = Buffer.from(JSON.stringify({ u: email, iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch (e) {
    return null;
  }
}

export function checkCreds(email, password) {
  const E = env.ADMIN_EMAIL;
  const P = env.ADMIN_PASSWORD;
  if (!E || !P) return false;
  return email === E && password === P;
}

export const cookieName = COOKIE;
export const cookieMaxAge = MAX_AGE;
