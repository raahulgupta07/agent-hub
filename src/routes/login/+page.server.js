import { fail, redirect } from '@sveltejs/kit';
import { checkCreds, createToken, cookieName, cookieMaxAge } from '$lib/server/auth.js';

export function load({ locals }) {
  if (locals.user) throw redirect(303, '/admin');
  return {};
}

export const actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const email = (data.get('email') ?? '').toString().trim();
    const password = (data.get('password') ?? '').toString();

    if (!checkCreds(email, password)) {
      return fail(401, { email, error: 'Invalid email or password.' });
    }

    cookies.set(cookieName, createToken(email), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      maxAge: cookieMaxAge
    });
    throw redirect(303, '/admin');
  }
};
