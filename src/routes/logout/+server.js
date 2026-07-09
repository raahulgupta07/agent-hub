import { redirect } from '@sveltejs/kit';
import { cookieName } from '$lib/server/auth.js';

export function GET({ cookies }) {
  cookies.delete(cookieName, { path: '/' });
  throw redirect(303, '/');
}
