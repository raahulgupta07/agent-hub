// Client-side logo processing for agent cards. Runs entirely in the browser
// (canvas) — no model, no network, works offline.
//
// processLogo(file, { removeBg }) -> Promise<dataURL(png)>
//   - downscales to fit maxSize
//   - optional background knockout: samples the image corners and makes pixels
//     close to that color transparent (great for logos on white/solid bg;
//     skipped automatically if the image is already transparent)
//   - trims transparent margins and centers on a square canvas

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

function colorDist(d, i, r, g, b) {
  const dr = d[i] - r;
  const dg = d[i + 1] - g;
  const db = d[i + 2] - b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Sample the four corners; return the dominant background color, or null if the
// corners are already transparent (nothing to key out).
function sampleBackground(data, w, h) {
  const pts = [];
  const s = Math.max(2, Math.round(Math.min(w, h) * 0.06));
  const corners = [
    [0, 0],
    [w - s, 0],
    [0, h - s],
    [w - s, h - s]
  ];
  let opaque = 0;
  let rt = 0;
  let gt = 0;
  let bt = 0;
  let n = 0;
  for (const [cx, cy] of corners) {
    for (let y = cy; y < cy + s; y++) {
      for (let x = cx; x < cx + s; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] > 200) opaque++;
        rt += data[i];
        gt += data[i + 1];
        bt += data[i + 2];
        n++;
      }
    }
  }
  if (n === 0) return null;
  // If corners are mostly transparent already, assume a clean PNG — skip.
  if (opaque / n < 0.5) return null;
  return { r: rt / n, g: gt / n, b: bt / n };
}

function keyOutBackground(imageData) {
  const { data, width: w, height: h } = imageData;
  const bg = sampleBackground(data, w, h);
  if (!bg) return; // already transparent
  const tol = 46; // full-transparent threshold
  const ramp = 28; // soft edge band
  for (let i = 0; i < data.length; i += 4) {
    const d = colorDist(data, i, bg.r, bg.g, bg.b);
    if (d < tol) {
      data[i + 3] = 0;
    } else if (d < tol + ramp) {
      data[i + 3] = Math.round(data[i + 3] * ((d - tol) / ramp));
    }
  }
}

function trimAndSquare(srcCanvas, imageData, padRatio) {
  const { data, width: w, height: h } = imageData;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let found = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 16) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) {
    minX = 0;
    minY = 0;
    maxX = w - 1;
    maxY = h - 1;
  }
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const side = Math.round(Math.max(cw, ch) * (1 + padRatio * 2));
  const out = document.createElement('canvas');
  out.width = side;
  out.height = side;
  const octx = out.getContext('2d');
  octx.drawImage(srcCanvas, minX, minY, cw, ch, (side - cw) / 2, (side - ch) / 2, cw, ch);
  return out.toDataURL('image/png');
}

export async function processLogo(file, opts = {}) {
  const removeBg = opts.removeBg !== false;
  const maxSize = opts.maxSize || 256;

  const img = await loadImage(file);
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  if (removeBg) {
    keyOutBackground(imageData);
    ctx.putImageData(imageData, 0, 0);
  }

  return trimAndSquare(canvas, imageData, opts.padding ?? 0.1);
}
