import { redirect, error } from '@sveltejs/kit';
import { verifyToken, cookieName } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
  event.locals.user = verifyToken(event.cookies.get(cookieName));

  const path = event.url.pathname;
  const method = event.request.method;

  // Guard the admin UI.
  if (path.startsWith('/admin') && !event.locals.user) {
    throw redirect(303, '/login');
  }
  // Guard config writes (GET is public — the directory needs to read it).
  if (path === '/api/config' && method !== 'GET' && !event.locals.user) {
    throw error(401, 'Unauthorized');
  }

  return resolve(event);
}
