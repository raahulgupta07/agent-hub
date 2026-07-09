import { readConfig } from '$lib/server/store.js';

// Runs on the server for every route; seeds the client store with the shared,
// file-persisted config and exposes the authenticated user (if any).
export function load({ locals }) {
  return { ...readConfig(), user: locals.user ? { email: locals.user.u } : null };
}
