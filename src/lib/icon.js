// Validate an agent logo (iconData). Only accept reasonably-sized raster image
// data-URLs; reject SVG (script vector), external URLs, and oversized blobs.
const MAX_BYTES = 600 * 1024; // ~600 KB of base64
const OK = /^data:image\/(png|jpe?g|webp|gif);base64,/i;

export function sanitizeIconData(v) {
  if (!v || typeof v !== 'string') return '';
  if (!OK.test(v)) return '';
  if (v.length > MAX_BYTES) return '';
  return v;
}
