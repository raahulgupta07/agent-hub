import { json } from '@sveltejs/kit';

// Unauthenticated liveness probe (used by Docker healthcheck).
export function GET() {
  return json({ ok: true });
}
