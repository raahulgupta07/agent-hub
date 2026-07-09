// Block dangerous URL schemes on stored links (card + ad URLs). Admin-entered,
// but a malicious/typo'd javascript: URL would run on click. Allow only safe
// schemes and relative/anchor links.
const BLOCKED = /^\s*(javascript|data|vbscript|file):/i;

export function sanitizeUrl(raw) {
  if (raw == null) return raw;
  const s = String(raw).trim();
  if (s === '' || s === '#') return s;
  if (BLOCKED.test(s)) return '#';
  return s;
}
