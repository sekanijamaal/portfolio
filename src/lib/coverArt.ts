import type { Book, CoverLayout, BookPalette } from '../data/books';

const W = 448;
const H = 672;
const M = 34;
const SERIF = '"Libre Caslon Display", Georgia, "Times New Roman", serif';
const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

type Ctx = CanvasRenderingContext2D;
type Rect = { x: number; y: number; w: number; h: number };

export interface CoverAsset {
  id: number;
  canvas: HTMLCanvasElement;
  dataUrl: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function mix(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const t = Math.max(0, Math.min(1, amount));
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function contrastText(hex: string): string {
  return luminance(hex) > 0.55 ? '#15120d' : '#f5f0e6';
}

function seeded(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function rr(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: string,
  stroke?: string,
  lineWidth = 1,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function setFont(ctx: Ctx, size: number, family: 'serif' | 'sans', weight = 400) {
  ctx.font = `${weight} ${size}px ${family === 'serif' ? SERIF : SANS}`;
}

function trackedWidth(ctx: Ctx, text: string, tracking: number): number {
  let width = 0;
  for (const char of text) width += ctx.measureText(char).width + tracking;
  return Math.max(0, width - tracking);
}

function tracked(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: 'left' | 'center' | 'right' = 'left',
) {
  const width = trackedWidth(ctx, text, tracking);
  let cursor = x;
  if (align === 'center') cursor = x - width / 2;
  if (align === 'right') cursor = x - width;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}

function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

interface FittedTitle {
  size: number;
  lines: string[];
  lineHeight: number;
}

function fitTitle(
  ctx: Ctx,
  text: string,
  maxWidth: number,
  maxHeight: number,
  startSize: number,
  maxLines = 3,
): FittedTitle {
  for (let size = startSize; size >= 20; size -= 1) {
    setFont(ctx, size, 'serif');
    const letterSpacing = size * -0.018;
    (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
    const lines = wrap(ctx, text, maxWidth);
    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width));
    const lineHeight = size * 0.95;
    if (lines.length <= maxLines && widest <= maxWidth && lines.length * lineHeight <= maxHeight) {
      (ctx as Ctx & { letterSpacing: string }).letterSpacing = '0px';
      return { size, lines, lineHeight };
    }
    (ctx as Ctx & { letterSpacing: string }).letterSpacing = '0px';
  }
  setFont(ctx, 20, 'serif');
  const lines = wrap(ctx, text, maxWidth);
  return { size: 20, lines, lineHeight: 19 };
}

function drawTitle(
  ctx: Ctx,
  fitted: FittedTitle,
  x: number,
  firstBaseline: number,
  color: string,
  align: CanvasTextAlign = 'left',
) {
  setFont(ctx, fitted.size, 'serif');
  (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${fitted.size * -0.018}px`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  fitted.lines.forEach((line, i) => {
    ctx.fillText(line, x, firstBaseline + i * fitted.lineHeight);
  });
  ctx.textAlign = 'left';
  (ctx as Ctx & { letterSpacing: string }).letterSpacing = '0px';
}

/* ------------------------------------------------------------------ */
/* Motifs                                                              */
/* ------------------------------------------------------------------ */

function horizon(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const sky = ctx.createLinearGradient(0, area.y, 0, area.y + area.h * 0.68);
  sky.addColorStop(0, p.deep);
  sky.addColorStop(0.55, mix(p.deep, p.soft, 0.55));
  sky.addColorStop(1, mix(p.soft, p.accent, 0.55));
  ctx.fillStyle = sky;
  ctx.fillRect(area.x, area.y, area.w, area.h);

  for (let i = 0; i < 6; i += 1) {
    const y = area.y + area.h * (0.18 + i * 0.055);
    const h = area.h * (0.008 + rnd() * 0.016);
    ctx.fillStyle = alpha(p.accent, 0.08 + rnd() * 0.1);
    ctx.fillRect(area.x, y, area.w, h);
  }

  const horizonY = area.y + area.h * 0.68;
  const sunX = area.x + area.w * 0.63;
  const sunY = horizonY - area.h * 0.16;
  const sunR = area.w * 0.145;

  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 1.6, 0, Math.PI * 2);
  ctx.fillStyle = alpha(p.accent, 0.1);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();

  const sea = ctx.createLinearGradient(0, horizonY, 0, area.y + area.h);
  sea.addColorStop(0, mix(p.deep, p.soft, 0.4));
  sea.addColorStop(1, p.deep);
  ctx.fillStyle = sea;
  ctx.fillRect(area.x, horizonY, area.w, area.h - (horizonY - area.y));

  ctx.fillStyle = alpha(p.ink, 0.38);
  ctx.fillRect(area.x, horizonY, area.w, 1);

  for (let i = 0; i < 12; i += 1) {
    const y = horizonY + area.h * (0.055 + i * 0.036);
    const w = area.w * (0.08 + rnd() * 0.36);
    const x = area.x + area.w * (0.08 + rnd() * 0.6);
    ctx.fillStyle = alpha(p.accent, 0.1 + rnd() * 0.22);
    ctx.fillRect(x, y, w, 1.2);
  }

  ctx.restore();
}

function arch(ctx: Ctx, area: Rect, p: BookPalette, _rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const ax = area.x + area.w * 0.16;
  const aw = area.w * 0.62;
  const ay = area.y + area.h * 0.16;
  const ah = area.h * 0.9;

  const shadow = ctx.createLinearGradient(ax, ay, ax + aw, ay + ah);
  shadow.addColorStop(0, alpha(p.accent, 0.95));
  shadow.addColorStop(1, alpha(p.soft, 0.9));
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.moveTo(ax, ay + ah);
  ctx.lineTo(ax, ay + aw / 2);
  ctx.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0);
  ctx.lineTo(ax + aw, ay + ah);
  ctx.closePath();
  ctx.fill();

  const ix = ax + aw * 0.28;
  const iw = aw * 0.44;
  const iy = ay + aw * 0.28 + 12;
  const ih = ah * 0.82;
  ctx.fillStyle = p.bg;
  ctx.beginPath();
  ctx.moveTo(ix, iy + ih);
  ctx.lineTo(ix, iy + iw / 2);
  ctx.arc(ix + iw / 2, iy + iw / 2, iw / 2, Math.PI, 0);
  ctx.lineTo(ix + iw, iy + ih);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ix + iw / 2, iy + iw * 0.95, iw * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();

  for (let i = 0; i < 5; i += 1) {
    const x = area.x + area.w * (0.08 + i * 0.21);
    ctx.fillStyle = alpha(p.ink, 0.13);
    ctx.fillRect(x, area.y + area.h * 0.1, 1, area.h * 0.78);
  }

  ctx.fillStyle = alpha(p.ink, 0.24);
  ctx.fillRect(area.x, area.y + area.h * 0.9, area.w, 1);

  ctx.restore();
}

function grid(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const step = Math.max(18, area.w / 11);
  ctx.lineWidth = 1;
  for (let x = area.x + step / 2; x < area.x + area.w; x += step) {
    ctx.strokeStyle = alpha(p.accent, 0.16);
    ctx.beginPath();
    ctx.moveTo(x, area.y);
    ctx.lineTo(x, area.y + area.h);
    ctx.stroke();
  }
  for (let y = area.y + step / 2; y < area.y + area.h; y += step) {
    ctx.strokeStyle = alpha(p.accent, 0.16);
    ctx.beginPath();
    ctx.moveTo(area.x, y);
    ctx.lineTo(area.x + area.w, y);
    ctx.stroke();
  }

  const cols = 4;
  const rows = 3;
  const cw = (area.w * 0.52) / cols;
  const ch = (area.h * 0.48) / rows;
  const ox = area.x + area.w * 0.22;
  const oy = area.y + area.h * 0.25;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (rnd() > 0.45) {
        ctx.fillStyle = alpha(p.accent, rnd() > 0.6 ? 0.82 : 0.28);
        ctx.fillRect(ox + c * cw + 2, oy + r * ch + 2, cw - 4, ch - 4);
      }
    }
  }

  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.72, area.y + area.h * 0.7, area.w * 0.13, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(p.ink, 0.55);
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.72, area.y + area.h * 0.7, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();

  ctx.restore();
}

function contour(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const lines = 15;
  for (let i = 0; i < lines; i += 1) {
    const t = i / (lines - 1);
    const baseY = area.y + area.h * (0.12 + t * 0.78);
    const amp = area.h * (0.018 + t * 0.016);
    const phase = rnd() * Math.PI * 2;
    ctx.beginPath();
    for (let x = 0; x <= area.w; x += 4) {
      const u = x / area.w;
      const y =
        baseY +
        Math.sin(u * Math.PI * (2.2 + t) + phase) * amp +
        Math.sin(u * Math.PI * 7 + i) * amp * 0.24;
      if (x === 0) ctx.moveTo(area.x + x, y);
      else ctx.lineTo(area.x + x, y);
    }
    ctx.strokeStyle = alpha(i % 5 === 0 ? p.accent : p.soft, i % 5 === 0 ? 0.75 : 0.38);
    ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.8;
    ctx.stroke();
  }

  const mx = area.x + area.w * 0.7;
  const my = area.y + area.h * 0.48;
  ctx.beginPath();
  ctx.arc(mx, my, 4, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mx, my, 11, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(p.accent, 0.45);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function blocks(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const rects = [
    { x: 0.08, y: 0.12, w: 0.34, h: 0.54, c: p.accent, a: 0.95 },
    { x: 0.48, y: 0.06, w: 0.26, h: 0.34, c: p.soft, a: 0.9 },
    { x: 0.58, y: 0.44, w: 0.34, h: 0.46, c: p.accent, a: 0.32 },
    { x: 0.14, y: 0.7, w: 0.3, h: 0.18, c: p.ink, a: 0.6 },
  ];
  for (const r of rects) {
    ctx.fillStyle = alpha(r.c, r.a);
    ctx.fillRect(area.x + area.w * r.x, area.y + area.h * r.y, area.w * r.w, area.h * r.h);
  }

  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.62, area.y + area.h * 0.3, area.w * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.62, area.y + area.h * 0.3, area.w * 0.12, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(p.ink, 0.4);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = alpha(p.ink, 0.22);
  ctx.fillRect(area.x + area.w * 0.08, area.y + area.h * 0.9, area.w * 0.84, 1);
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = alpha(p.ink, 0.2 + rnd() * 0.2);
    ctx.fillRect(area.x + area.w * (0.78 + i * 0.04), area.y + area.h * 0.08, 1, area.h * 0.1);
  }

  ctx.restore();
}

function waves(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const bands = 11;
  for (let i = 0; i < bands; i += 1) {
    const t = i / (bands - 1);
    const y = area.y + area.h * (0.12 + t * 0.8);
    const amp = area.h * (0.02 + (1 - t) * 0.018);
    const phase = rnd() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(area.x, y);
    for (let x = 0; x <= area.w; x += 3) {
      const u = x / area.w;
      ctx.lineTo(area.x + x, y + Math.sin(u * Math.PI * 2.4 + phase) * amp);
    }
    ctx.lineTo(area.x + area.w, area.y + area.h);
    ctx.lineTo(area.x, area.y + area.h);
    ctx.closePath();
    ctx.fillStyle = alpha(i % 2 === 0 ? p.accent : p.soft, 0.07 + t * 0.12);
    ctx.fill();
  }

  for (let i = 0; i < 4; i += 1) {
    const y = area.y + area.h * (0.3 + i * 0.16);
    ctx.beginPath();
    ctx.moveTo(area.x + area.w * 0.1, y);
    ctx.bezierCurveTo(
      area.x + area.w * 0.35,
      y - area.h * 0.06,
      area.x + area.w * 0.6,
      y + area.h * 0.06,
      area.x + area.w * 0.9,
      y,
    );
    ctx.strokeStyle = alpha(p.ink, 0.18);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function arcs(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const cx = area.x + area.w * 0.22;
  const cy = area.y + area.h * 0.82;
  const maxR = area.w * 0.9;
  for (let i = 0; i < 9; i += 1) {
    const r = maxR * (0.16 + i * 0.1);
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 1.08, Math.PI * 1.92);
    ctx.strokeStyle = alpha(i % 3 === 0 ? p.accent : p.soft, 0.28 + (i % 3) * 0.16);
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();

  for (let i = 0; i < 6; i += 1) {
    const x = area.x + area.w * (0.56 + rnd() * 0.34);
    const y = area.y + area.h * (0.16 + rnd() * 0.6);
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = alpha(p.ink, 0.35);
    ctx.fill();
  }

  ctx.restore();
}

function nodes(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const count = 8;
  const pts = Array.from({ length: count }, (_, i) => ({
    x: area.x + area.w * (0.12 + rnd() * 0.76),
    y: area.y + area.h * (0.12 + rnd() * 0.76),
    r: i === 0 ? 7 : 2 + rnd() * 4,
    hot: i % 4 === 0,
  }));

  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = alpha(p.accent, 0.2 + (i % 3) * 0.1);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.lineTo(pts[3].x, pts[3].y);
  ctx.strokeStyle = alpha(p.ink, 0.15);
  ctx.stroke();

  for (const pt of pts) {
    if (pt.hot) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = alpha(p.accent, 0.3);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
    ctx.fillStyle = pt.hot ? p.accent : p.bg;
    ctx.fill();
    ctx.strokeStyle = alpha(p.accent, pt.hot ? 1 : 0.6);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  ctx.restore();
}

function bars(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const n = 9;
  const gap = area.w / (n + 1);
  for (let i = 0; i < n; i += 1) {
    const h = area.h * (0.16 + rnd() * 0.66);
    const x = area.x + gap * (i + 1) - 9;
    const y = area.y + area.h * 0.88 - h;
    ctx.fillStyle = alpha(i % 4 === 0 ? p.accent : p.soft, i % 4 === 0 ? 0.9 : 0.34);
    ctx.fillRect(x, y, 18, h);
    ctx.fillStyle = alpha(p.ink, 0.28);
    ctx.fillRect(x, area.y + area.h * 0.88, 18, 1);
  }

  ctx.strokeStyle = alpha(p.ink, 0.16);
  ctx.beginPath();
  ctx.moveTo(area.x, area.y);
  ctx.lineTo(area.x + area.w, area.y);
  ctx.stroke();

  ctx.restore();
}

function stairs(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const steps = 6;
  const sw = area.w * 0.52;
  const sh = area.h * 0.09;
  const ox = area.x + area.w * 0.16;
  const oy = area.y + area.h * 0.68;
  for (let i = 0; i < steps; i += 1) {
    const x = ox + i * sw * 0.13;
    const y = oy - i * sh;
    ctx.fillStyle = alpha(i % 2 === 0 ? p.accent : p.soft, 0.24 + i * 0.07);
    ctx.fillRect(x, y, sw, sh);
    ctx.fillStyle = alpha(p.deep, 0.45);
    ctx.beginPath();
    ctx.moveTo(x + sw, y);
    ctx.lineTo(x + sw + sw * 0.16, y - sw * 0.06);
    ctx.lineTo(x + sw + sw * 0.16, y + sh - sw * 0.06);
    ctx.lineTo(x + sw, y + sh);
    ctx.closePath();
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.76, area.y + area.h * 0.26, area.w * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = alpha(p.accent, 0.85);
  ctx.fill();
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = alpha(p.ink, 0.2 + rnd() * 0.2);
    ctx.fillRect(area.x + area.w * 0.12, area.y + area.h * (0.14 + i * 0.04), area.w * 0.2, 1);
  }

  ctx.restore();
}

function product(ctx: Ctx, area: Rect, p: BookPalette, _rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const cols = 3;
  const rows = 4;
  const gap = area.w * 0.035;
  const cw = (area.w * 0.74 - gap * (cols - 1)) / cols;
  const ch = (area.h * 0.8 - gap * (rows - 1)) / rows;
  const ox = area.x + area.w * 0.13;
  const oy = area.y + area.h * 0.1;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const filled = (r * cols + c) % 7 === 2;
      rr(
        ctx,
        ox + c * (cw + gap),
        oy + r * (ch + gap),
        cw,
        ch,
        2,
        filled ? p.accent : alpha(p.bg, 0.35),
        alpha(p.ink, filled ? 0 : 0.25),
        1,
      );
      if (filled) {
        ctx.fillStyle = alpha(p.ink, 0.8);
        ctx.fillRect(ox + c * (cw + gap) + cw * 0.18, oy + r * (ch + gap) + ch * 0.3, cw * 0.64, 1);
        ctx.fillRect(ox + c * (cw + gap) + cw * 0.18, oy + r * (ch + gap) + ch * 0.45, cw * 0.42, 1);
      }
    }
  }
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = alpha(p.accent, 0.45);
    ctx.fillRect(area.x + area.w * (0.13 + i * 0.05), area.y + area.h * 0.94, 2, 2);
  }
  ctx.restore();
}

function terminal(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const x = area.x + area.w * 0.08;
  const y = area.y + area.h * 0.1;
  const w = area.w * 0.84;
  const h = area.h * 0.8;
  rr(ctx, x, y, w, h, 4, alpha(p.deep, 0.8), alpha(p.accent, 0.35), 1);

  ctx.fillStyle = alpha(p.accent, 0.7);
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(x + 14 + i * 10, y + 14, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = alpha(p.ink, 0.12);
  ctx.fillRect(x + 8, y + 26, w - 16, 1);

  let cy = y + 48;
  for (let i = 0; i < 13; i += 1) {
    const indent = rnd() > 0.7 ? 18 : 0;
    const len = w * (0.18 + rnd() * 0.55);
    ctx.fillStyle = alpha(i % 4 === 0 ? p.accent : p.ink, i % 4 === 0 ? 0.75 : 0.28);
    ctx.fillRect(x + 18 + indent, cy, len, 1.4);
    if (rnd() > 0.72) {
      ctx.fillStyle = alpha(p.soft, 0.55);
      ctx.fillRect(x + 18 + indent + len + 6, cy, w * 0.08, 1.4);
    }
    cy += 13;
  }

  ctx.fillStyle = alpha(p.accent, 0.95);
  ctx.fillRect(x + 18, cy + 3, 7, 9);
  ctx.fillStyle = alpha(p.ink, 0.5);
  setFont(ctx, 8, 'sans', 500);
  ctx.fillText('~/sidney', x + w - 58, y + 14);

  ctx.restore();
}

function rings(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const cx = area.x + area.w * 0.62;
  const cy = area.y + area.h * 0.46;
  for (let i = 8; i >= 0; i -= 1) {
    const r = area.w * (0.06 + i * 0.062);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = alpha(i % 2 === 0 ? p.accent : p.soft, 0.2 + (8 - i) * 0.035);
    ctx.lineWidth = i % 3 === 0 ? 1.8 : 0.8;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, area.w * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = alpha(p.accent, 0.8);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(area.x + area.w * 0.1, area.y + area.h * 0.9);
  ctx.lineTo(area.x + area.w * 0.44, area.y + area.h * 0.56);
  ctx.strokeStyle = alpha(p.ink, 0.3);
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(
      area.x + area.w * (0.16 + rnd() * 0.2),
      area.y + area.h * (0.2 + rnd() * 0.6),
      1.2,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = alpha(p.ink, 0.4);
    ctx.fill();
  }

  ctx.restore();
}

function stripes(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const bandH = area.h * 0.44;
  const y = area.y + area.h * 0.28;
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, y, area.w, bandH);
  ctx.clip();
  ctx.translate(area.x, y);
  ctx.rotate(-0.34);
  for (let x = -area.w; x < area.w * 2; x += 13) {
    ctx.fillStyle = alpha(rnd() > 0.5 ? p.accent : p.soft, 0.28 + rnd() * 0.4);
    ctx.fillRect(x, -bandH, 5, bandH * 3);
  }
  ctx.restore();

  ctx.strokeStyle = alpha(p.ink, 0.25);
  ctx.beginPath();
  ctx.moveTo(area.x, y);
  ctx.lineTo(area.x + area.w, y);
  ctx.moveTo(area.x, y + bandH);
  ctx.lineTo(area.x + area.w, y + bandH);
  ctx.stroke();

  ctx.fillStyle = alpha(p.accent, 0.8);
  ctx.fillRect(area.x + area.w * 0.1, area.y + area.h * 0.82, area.w * 0.16, 2);

  ctx.restore();
}

function pulse(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const cx = area.x + area.w * 0.54;
  const cy = area.y + area.h * 0.48;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, area.w * 0.6);
  glow.addColorStop(0, alpha(p.accent, 0.4));
  glow.addColorStop(0.25, alpha(p.accent, 0.14));
  glow.addColorStop(1, alpha(p.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(area.x, area.y, area.w, area.h);

  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, area.w * (0.1 + i * 0.075), 0, Math.PI * 2);
    ctx.strokeStyle = alpha(p.accent, 0.42 - i * 0.05);
    ctx.lineWidth = i === 0 ? 2 : 1;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(area.x, cy + area.h * 0.24);
  for (let x = 0; x <= area.w; x += 4) {
    const u = x / area.w;
    const spike = Math.exp(-Math.pow((u - 0.54) * 9, 2)) * area.h * 0.18;
    ctx.lineTo(area.x + x, cy + area.h * 0.24 - spike * Math.sin(u * 90));
  }
  ctx.strokeStyle = alpha(p.ink, 0.3);
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = 0; i < 14; i += 1) {
    ctx.fillStyle = alpha(p.ink, 0.1 + rnd() * 0.14);
    ctx.fillRect(area.x + rnd() * area.w, area.y + rnd() * area.h, 1, 1);
  }

  ctx.restore();
}

function shield(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const cx = area.x + area.w * 0.5;
  const top = area.y + area.h * 0.14;
  const sw = area.w * 0.34;
  const sh = area.h * 0.64;
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx + sw / 2, top + sh * 0.16);
    ctx.lineTo(cx + sw / 2, top + sh * 0.58);
    ctx.quadraticCurveTo(cx + sw * 0.4, top + sh * 0.88, cx, top + sh);
    ctx.quadraticCurveTo(cx - sw * 0.4, top + sh * 0.88, cx - sw / 2, top + sh * 0.58);
    ctx.lineTo(cx - sw / 2, top + sh * 0.16);
    ctx.closePath();
  };
  path();
  ctx.fillStyle = alpha(p.accent, 0.2);
  ctx.fill();
  path();
  ctx.strokeStyle = alpha(p.accent, 0.9);
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, top + sh * 0.38);
  ctx.beginPath();
  ctx.arc(0, 0, sw * 0.09, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();
  ctx.fillRect(-sw * 0.025, sw * 0.05, sw * 0.05, sw * 0.16);
  ctx.restore();

  for (let i = 0; i < 8; i += 1) {
    const x = area.x + area.w * (0.1 + rnd() * 0.8);
    const y = area.y + area.h * (0.12 + rnd() * 0.76);
    if (Math.abs(x - cx) > sw * 0.7) {
      ctx.fillStyle = alpha(p.ink, 0.18);
      ctx.fillRect(x, y, 1, 1);
    }
  }

  ctx.restore();
}

function speed(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  for (let i = 0; i < 15; i += 1) {
    const y = area.y + area.h * (0.14 + i * 0.048);
    const len = area.w * (0.16 + rnd() * 0.62);
    const x = area.x + area.w * (0.06 + rnd() * 0.1);
    ctx.fillStyle = alpha(i % 5 === 0 ? p.accent : p.ink, i % 5 === 0 ? 0.7 : 0.16 + rnd() * 0.2);
    ctx.fillRect(x, y, len, i % 5 === 0 ? 2 : 1);
  }

  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.78, area.y + area.h * 0.52, area.w * 0.18, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(p.accent, 0.7);
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(area.x + area.w * 0.78, area.y + area.h * 0.52, area.w * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = alpha(p.accent, 0.8);
  ctx.fill();

  ctx.restore();
}

function moon(ctx: Ctx, area: Rect, p: BookPalette, rnd: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.w, area.h);
  ctx.clip();

  const cx = area.x + area.w * 0.66;
  const cy = area.y + area.h * 0.4;
  const r = area.w * 0.24;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = alpha(p.accent, 0.85);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - r * 0.42, cy - r * 0.12, r * 0.96, 0, Math.PI * 2);
  ctx.fillStyle = p.bg;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.55, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(p.accent, 0.3);
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = 0; i < 18; i += 1) {
    const x = area.x + rnd() * area.w;
    const y = area.y + rnd() * area.h;
    const d = Math.hypot(x - cx, y - cy);
    if (d > r * 1.7) {
      ctx.fillStyle = alpha(p.ink, 0.18 + rnd() * 0.25);
      ctx.beginPath();
      ctx.arc(x, y, rnd() > 0.8 ? 1.4 : 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawMotif(ctx: Ctx, book: Book, area: Rect) {
  const rnd = seeded(book.id * 97 + 13);
  switch (book.motif) {
    case 'horizon':
      return horizon(ctx, area, book.palette, rnd);
    case 'arch':
      return arch(ctx, area, book.palette, rnd);
    case 'grid':
      return grid(ctx, area, book.palette, rnd);
    case 'contour':
      return contour(ctx, area, book.palette, rnd);
    case 'blocks':
      return blocks(ctx, area, book.palette, rnd);
    case 'waves':
      return waves(ctx, area, book.palette, rnd);
    case 'arcs':
      return arcs(ctx, area, book.palette, rnd);
    case 'nodes':
      return nodes(ctx, area, book.palette, rnd);
    case 'bars':
      return bars(ctx, area, book.palette, rnd);
    case 'stairs':
      return stairs(ctx, area, book.palette, rnd);
    case 'product':
      return product(ctx, area, book.palette, rnd);
    case 'terminal':
      return terminal(ctx, area, book.palette, rnd);
    case 'rings':
      return rings(ctx, area, book.palette, rnd);
    case 'stripes':
      return stripes(ctx, area, book.palette, rnd);
    case 'pulse':
      return pulse(ctx, area, book.palette, rnd);
    case 'shield':
      return shield(ctx, area, book.palette, rnd);
    case 'speed':
      return speed(ctx, area, book.palette, rnd);
    case 'moon':
      return moon(ctx, area, book.palette, rnd);
    default:
      return;
  }
}

/* ------------------------------------------------------------------ */
/* Layout chrome                                                       */
/* ------------------------------------------------------------------ */

function drawPaper(ctx: Ctx, book: Book) {
  const p = book.palette;
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);

  const light = ctx.createLinearGradient(0, 0, 0, H);
  light.addColorStop(0, alpha('#ffffff', 0.045));
  light.addColorStop(0.5, alpha('#ffffff', 0));
  light.addColorStop(1, alpha('#000000', 0.12));
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);
}

function drawTopMeta(ctx: Ctx, book: Book, onImage = false) {
  const p = book.palette;
  if (onImage) {
    const scrim = ctx.createLinearGradient(0, 0, 0, 96);
    scrim.addColorStop(0, alpha(p.deep, 0.65));
    scrim.addColorStop(1, alpha(p.deep, 0));
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, 96);
  }
  setFont(ctx, 8.2, 'sans', 500);
  ctx.fillStyle = alpha(p.ink, onImage ? 0.88 : 0.7);
  tracked(ctx, book.eyebrow.toUpperCase(), M, 44, 1.45);
  tracked(ctx, `VOL. ${String(book.id + 1).padStart(2, '0')}`, W - M, 44, 1.45, 'right');
  ctx.fillStyle = alpha(p.ink, 0.24);
  ctx.fillRect(M, 55, W - M * 2, 1);
}

function drawBottomMeta(ctx: Ctx, book: Book, y = H - 28) {
  const p = book.palette;
  setFont(ctx, 7.5, 'sans', 500);
  ctx.fillStyle = alpha(p.ink, 0.58);
  tracked(ctx, book.author.toUpperCase(), M, y, 1.3);
  tracked(ctx, 'S.O. PRESS', W - M, y, 1.3, 'right');
}

function drawSubtitle(ctx: Ctx, book: Book, x: number, y: number, maxWidth: number, color?: string) {
  const p = book.palette;
  setFont(ctx, 10, 'sans', 400);
  ctx.fillStyle = color ?? alpha(p.ink, 0.66);
  const lines = wrap(ctx, book.subtitle, maxWidth).slice(0, 2);
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * 15);
  });
  return lines.length;
}

function drawBarcode(ctx: Ctx, book: Book, x: number, y: number) {
  const p = book.palette;
  const rnd = seeded(book.id + 4);
  ctx.fillStyle = alpha(p.ink, 0.35);
  for (let i = 0; i < 15; i += 1) {
    ctx.fillRect(x + i * 3, y, rnd() > 0.6 ? 1.6 : 0.8, 16);
  }
}

function drawGrain(ctx: Ctx, book: Book) {
  const p = book.palette;
  const rnd = seeded(book.id * 313 + 7);
  ctx.save();
  for (let i = 0; i < 1300; i += 1) {
    const x = rnd() * W;
    const y = rnd() * H;
    ctx.fillStyle = alpha(rnd() > 0.5 ? p.ink : p.deep, 0.015 + rnd() * 0.035);
    ctx.fillRect(x, y, rnd() > 0.85 ? 1.4 : 0.8, 0.8);
  }

  const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.95);
  vignette.addColorStop(0, alpha('#000000', 0));
  vignette.addColorStop(1, alpha('#000000', 0.18));
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawHinge(ctx: Ctx, book: Book) {
  const hinge = ctx.createLinearGradient(0, 0, 26, 0);
  hinge.addColorStop(0, alpha('#000000', 0.34));
  hinge.addColorStop(0.55, alpha('#000000', 0.12));
  hinge.addColorStop(1, alpha('#000000', 0));
  ctx.fillStyle = hinge;
  ctx.fillRect(0, 0, 26, H);
  ctx.fillStyle = alpha('#000000', 0.22);
  ctx.fillRect(22, 0, 1, H);
  ctx.fillStyle = alpha('#ffffff', 0.08);
  ctx.fillRect(W - 1, 0, 1, H);

  if (book.id % 4 === 1) {
    drawBarcode(ctx, book, W - M - 44, H - 58);
  }
}

function layoutEditorial(ctx: Ctx, book: Book) {
  const p = book.palette;
  drawTopMeta(ctx, book);

  const motifTop = 76;
  const motifH = H * 0.4;
  drawMotif(ctx, book, { x: M, y: motifTop, w: W - M * 2, h: motifH });
  ctx.strokeStyle = alpha(p.ink, 0.16);
  ctx.lineWidth = 1;
  ctx.strokeRect(M + 0.5, motifTop + 0.5, W - M * 2 - 1, motifH - 1);

  const title = book.displayTitle ?? book.title;
  const fitted = fitTitle(ctx, title, W - M * 2, 156, 56, 3);
  const blockH = fitted.lines.length * fitted.lineHeight;
  const firstBaseline = H - 142 - blockH + fitted.size * 0.82;
  drawTitle(ctx, fitted, M, firstBaseline, p.ink);

  const subY = firstBaseline + blockH + 20;
  const subLines = drawSubtitle(ctx, book, M, subY, W - M * 2);
  const ruleY = subY + subLines * 15 + 18;
  ctx.fillStyle = alpha(p.ink, 0.22);
  ctx.fillRect(M, ruleY, W - M * 2, 1);

  ctx.fillStyle = alpha(p.accent, 0.9);
  ctx.fillRect(M, ruleY, 42, 2);

  drawBottomMeta(ctx, book);
}

function layoutSplit(ctx: Ctx, book: Book) {
  const p = book.palette;
  const motifH = H * 0.585;
  drawMotif(ctx, book, { x: 0, y: 0, w: W, h: motifH });
  drawTopMeta(ctx, book, true);

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, motifH, W, H - motifH);
  ctx.fillStyle = alpha(p.accent, 0.9);
  ctx.fillRect(0, motifH, W, 2);

  const title = book.displayTitle ?? book.title;
  const fitted = fitTitle(ctx, title, W - M * 2, 128, 48, 2);
  const firstBaseline = motifH + 24 + fitted.size * 0.84;
  drawTitle(ctx, fitted, M, firstBaseline, p.ink);

  const subY = firstBaseline + fitted.lines.length * fitted.lineHeight + 14;
  const subLines = drawSubtitle(ctx, book, M, subY, W * 0.7);
  const ruleY = Math.min(subY + subLines * 15 + 14, H - 62);
  ctx.fillStyle = alpha(p.ink, 0.2);
  ctx.fillRect(M, ruleY, W - M * 2, 1);
  ctx.fillStyle = alpha(p.accent, 0.9);
  ctx.fillRect(M, ruleY, 34, 2);

  drawBottomMeta(ctx, book);
}

function layoutFull(ctx: Ctx, book: Book) {
  const p = book.palette;
  drawMotif(ctx, book, { x: 0, y: 0, w: W, h: H });

  const scrim = ctx.createLinearGradient(0, H * 0.38, 0, H);
  scrim.addColorStop(0, alpha(p.bg, 0));
  scrim.addColorStop(0.42, alpha(p.bg, 0.72));
  scrim.addColorStop(1, alpha(p.bg, 0.98));
  ctx.fillStyle = scrim;
  ctx.fillRect(0, H * 0.38, W, H * 0.62);

  drawTopMeta(ctx, book, true);

  const title = book.displayTitle ?? book.title;
  const fitted = fitTitle(ctx, title, W - M * 2, 146, 54, 3);
  const blockH = fitted.lines.length * fitted.lineHeight;
  const firstBaseline = H - 142 - blockH + fitted.size * 0.82;
  drawTitle(ctx, fitted, M, firstBaseline, p.ink);

  const subY = firstBaseline + blockH + 18;
  const subLines = drawSubtitle(ctx, book, M, subY, W - M * 2, alpha(p.ink, 0.76));
  const ruleY = subY + subLines * 15 + 16;
  ctx.fillStyle = alpha(p.accent, 0.8);
  ctx.fillRect(M, ruleY, 38, 2);
  drawBottomMeta(ctx, book);
}

function layoutBand(ctx: Ctx, book: Book) {
  const p = book.palette;
  const motifH = H * 0.4;
  drawMotif(ctx, book, { x: 0, y: 0, w: W, h: motifH + 30 });
  drawTopMeta(ctx, book, true);

  const bandY = H * 0.43;
  const bandH = H * 0.18;
  ctx.fillStyle = p.accent;
  ctx.fillRect(0, bandY, W, bandH);

  const ink = contrastText(p.accent);
  const title = book.displayTitle ?? book.title;
  const fitted = fitTitle(ctx, title, W - M * 2, bandH - 26, 42, 2);
  const blockH = fitted.lines.length * fitted.lineHeight;
  drawTitle(
    ctx,
    fitted,
    M,
    bandY + bandH / 2 - blockH / 2 + fitted.size * 0.8,
    ink,
  );

  setFont(ctx, 8, 'sans', 500);
  ctx.fillStyle = alpha(ink, 0.7);
  tracked(ctx, `VOL. ${String(book.id + 1).padStart(2, '0')}`, W - M, bandY + 20, 1.4, 'right');

  const subY = bandY + bandH + 30;
  drawSubtitle(ctx, book, M, subY, W - M * 2);

  ctx.fillStyle = alpha(p.ink, 0.2);
  ctx.fillRect(M, subY + 30, W - M * 2, 1);
  ctx.fillStyle = alpha(p.accent, 0.9);
  ctx.fillRect(M, subY + 30, 30, 2);

  drawBottomMeta(ctx, book);
}

function layoutFrame(ctx: Ctx, book: Book) {
  const p = book.palette;
  drawTopMeta(ctx, book);

  const fx = 18;
  const fy = 18;
  const fw = W - 36;
  const fh = H - 36;
  ctx.strokeStyle = alpha(p.ink, 0.28);
  ctx.lineWidth = 1;
  ctx.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);

  const motifTop = 76;
  const motifH = H * 0.42;
  drawMotif(ctx, book, { x: M + 8, y: motifTop, w: W - (M + 8) * 2, h: motifH });

  const title = book.displayTitle ?? book.title;
  const fitted = fitTitle(ctx, title, W - (M + 8) * 2, 140, 50, 3);
  const blockH = fitted.lines.length * fitted.lineHeight;
  const firstBaseline = H - 146 - blockH + fitted.size * 0.82;
  drawTitle(ctx, fitted, M + 8, firstBaseline, p.ink);

  const subY = firstBaseline + blockH + 18;
  const subLines = drawSubtitle(ctx, book, M + 8, subY, W - (M + 8) * 2);
  const ruleY = subY + subLines * 15 + 16;
  ctx.fillStyle = alpha(p.accent, 0.85);
  ctx.fillRect(M + 8, ruleY, 34, 2);

  drawBottomMeta(ctx, book, H - 32);
}

function layoutType(ctx: Ctx, book: Book) {
  const p = book.palette;
  drawTopMeta(ctx, book);

  const markRnd = seeded(book.id * 41 + 3);
  const accentShape = book.id % 3;
  if (accentShape === 0) {
    ctx.beginPath();
    ctx.arc(W - M - 42, H * 0.19, 30, 0, Math.PI * 2);
    ctx.fillStyle = alpha(p.accent, 0.9);
    ctx.fill();
  } else if (accentShape === 1) {
    ctx.fillStyle = alpha(p.accent, 0.9);
    ctx.fillRect(M, H * 0.155, W - M * 2, 2);
    ctx.fillStyle = alpha(p.ink, 0.2);
    ctx.fillRect(M, H * 0.175, W - M * 2, 1);
  } else {
    ctx.save();
    ctx.translate(W - M - 34, H * 0.17);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = alpha(p.accent, 0.85);
    ctx.fillRect(-22, -22, 44, 44);
    ctx.restore();
  }

  const title = book.displayTitle ?? book.title;
  const fitted = fitTitle(ctx, title, W - M * 2, H * 0.46, 88, 3);
  const blockH = fitted.lines.length * fitted.lineHeight;
  const firstBaseline = H * 0.5 - blockH / 2 + fitted.size * 0.8;
  drawTitle(ctx, fitted, M, firstBaseline, p.ink);

  const ruleY = firstBaseline + blockH + 8;
  ctx.fillStyle = alpha(p.accent, 0.9);
  ctx.fillRect(M, ruleY, 48, 2);
  ctx.fillStyle = alpha(p.ink, 0.18);
  ctx.fillRect(M + 54, ruleY, W - M * 2 - 54, 1);

  const subY = ruleY + 28;
  drawSubtitle(ctx, book, M, subY, W - M * 2);

  ctx.save();
  setFont(ctx, 210, 'serif');
  ctx.textAlign = 'right';
  ctx.strokeStyle = alpha(p.ink, 0.11);
  ctx.lineWidth = 1;
  ctx.strokeText(String(book.id + 1).padStart(2, '0'), W - M + 6, H - 78);
  ctx.restore();

  if (markRnd() > 0.5) {
    drawBarcode(ctx, book, W - M - 44, H - 62);
  } else {
    ctx.beginPath();
    ctx.arc(W - M - 12, H - 70, 3, 0, Math.PI * 2);
    ctx.fillStyle = alpha(p.accent, 0.9);
    ctx.fill();
  }

  drawBottomMeta(ctx, book);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function drawCover(book: Book, scale = 1): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.scale(scale, scale);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  drawPaper(ctx, book);

  const layout = book.layout as CoverLayout;
  if (layout === 'editorial') layoutEditorial(ctx, book);
  else if (layout === 'split') layoutSplit(ctx, book);
  else if (layout === 'full') layoutFull(ctx, book);
  else if (layout === 'band') layoutBand(ctx, book);
  else if (layout === 'frame') layoutFrame(ctx, book);
  else layoutType(ctx, book);

  drawGrain(ctx, book);
  drawHinge(ctx, book);

  return canvas;
}

let coverPromise: Promise<CoverAsset[]> | null = null;
let coverCache: CoverAsset[] | null = null;

async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, 2200);
  });
  const fonts = Promise.all([
    document.fonts.load('400 64px "Libre Caslon Display"'),
    document.fonts.load('400 16px "Inter"'),
    document.fonts.load('500 16px "Inter"'),
    document.fonts.load('600 16px "Inter"'),
    document.fonts.ready,
  ]).then(() => undefined);
  await Promise.race([fonts, timeout]);
}

export function loadCoverArt(
  books: Book[],
  onProgress?: (done: number, total: number) => void,
): Promise<CoverAsset[]> {
  if (coverCache) {
    onProgress?.(coverCache.length, coverCache.length);
    return Promise.resolve(coverCache);
  }
  if (coverPromise) return coverPromise;

  coverPromise = (async () => {
    await waitForFonts();
    const assets: CoverAsset[] = [];
    for (let i = 0; i < books.length; i += 1) {
      const canvas = drawCover(books[i]);
      const dataUrl = canvas.toDataURL('image/webp', 0.9);
      assets.push({ id: books[i].id, canvas, dataUrl });
      onProgress?.(i + 1, books.length);
      if (i % 4 === 3) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 0);
        });
      }
    }
    coverCache = assets;
    return assets;
  })();

  return coverPromise;
}

export { W as COVER_WIDTH, H as COVER_HEIGHT };
