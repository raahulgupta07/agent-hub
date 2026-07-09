// Auto-convert a pasted OIDC/Keycloak *authorize* URL into the app's SSO-start
// endpoint. Authorize URLs carry a one-time state/nonce and only work once, so a
// card must instead point at the app's login-initiation route, which mints a
// fresh flow every click.
//
// Example:
//   in : https://iam.example.com/realms/x/protocol/openid-connect/auth
//          ?response_type=code&client_id=APP
//          &redirect_uri=https%3A%2F%2Fapp.example.com%2Foauth%2Foidc%2Fcallback
//          &state=ONE_TIME&nonce=ONE_TIME
//   out: https://app.example.com/oauth/oidc/login
//
// Anything that isn't an authorize URL is returned unchanged.
export function normalizeAgentUrl(raw) {
  if (!raw || typeof raw !== 'string') return raw;
  let u;
  try {
    u = new URL(raw.trim());
  } catch (e) {
    return raw; // not an absolute URL — leave as typed
  }

  const looksLikeAuthorize =
    /\/protocol\/openid-connect\/auth\/?$/.test(u.pathname) || u.searchParams.has('response_type');
  const redirectUri = u.searchParams.get('redirect_uri');
  if (!looksLikeAuthorize || !redirectUri) return raw;

  let cb;
  try {
    cb = new URL(redirectUri);
  } catch (e) {
    return raw;
  }

  // .../oauth/<provider>/callback  ->  .../oauth/<provider>/login
  const m = cb.pathname.match(/^(.*)\/callback\/?$/);
  const loginPath = m ? `${m[1]}/login` : '/';
  return `${cb.origin}${loginPath}`;
}
