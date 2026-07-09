import { fail, redirect } from '@sveltejs/kit';
import { checkCreds, createToken, cookieName, cookieMaxAge } from '$lib/server/auth.js';
import { isBlocked, recordFail, clearAttempts } from '$lib/server/loginThrottle.js';

export function load({ locals }) {
  if (locals.user) throw redirect(303, '/admin');
  return {};
}

export const actions = {
  default: async ({ request, cookies, url, getClientAddress }) => {
    const ip = getClientAddress();
    if (isBlocked(ip)) {
      return fail(429, { error: 'Too many attempts. Try again in a few minutes.' });
    }

    const data = await request.formData();
    const email = (data.get('email') ?? '').toString().trim();
    const password = (data.get('password') ?? '').toString();

    if (!checkCreds(email, password)) {
      recordFail(ip);
      return fail(401, { email, error: 'Invalid email or password.' });
    }

    clearAttempts(ip);
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
