import { handSvgString, seeded } from "./hand-geometry";
import { PALM_LINE_ORDER } from "./palm-data";

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

const DISPLAY = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Manrope Variable", system-ui, sans-serif';

const BRAND_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="96" height="96" fill="none"><path d="M10.5 29c-.6-2.6-2.2-4.4-3.9-6.3-1.4-1.6-2.6-3-2.1-4.4.5-1.3 2.1-1.2 3.3-.1l1.7 1.6V7.4c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v7.3V4.6c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v10.1V6c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v9.2-6.6c0-1 .7-1.7 1.6-1.7s1.5.7 1.5 1.7V19c0 4.3-1.6 7.3-3.4 10" stroke="#d4c6ff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.4 19.6c1.6-1.3 3.7-1.6 6.6-.9" stroke="#e3c88f" stroke-width="1.2" stroke-linecap="round"/></svg>`;

function loadSvg(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not render illustration"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

function setSpacing(ctx: CanvasRenderingContext2D, px: number) {
  // letterSpacing is supported in modern Chromium/Safari/Firefox; harmless where missing.
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${px}px`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface ShareCardContent {
  title: string;
  tagline: string;
}

/**
 * Renders the shareable result card to a PNG entirely in the browser.
 * Contains only the profile title and tagline — never the palm photo or answers.
 */
export async function renderShareCard({ title, tagline }: ShareCardContent): Promise<Blob> {
  await Promise.all(
    [`500 120px ${DISPLAY}`, `italic 500 56px ${DISPLAY}`, `600 28px ${SANS}`, `400 28px ${SANS}`].map((f) =>
      document.fonts.load(f).catch(() => undefined),
    ),
  );

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  const cx = CARD_WIDTH / 2;

  // Sky
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  bg.addColorStop(0, "#1b1236");
  bg.addColorStop(0.55, "#0e0920");
  bg.addColorStop(1, "#06040d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const glow = ctx.createRadialGradient(cx, 1080, 0, cx, 1080, 620);
  glow.addColorStop(0, "rgba(109, 74, 224, 0.55)");
  glow.addColorStop(1, "rgba(109, 74, 224, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Stars
  const rand = seeded(1027);
  for (let i = 0; i < 140; i++) {
    const gold = rand() > 0.85;
    ctx.globalAlpha = 0.25 + rand() * 0.6;
    ctx.fillStyle = gold ? "#e3c88f" : "#d4c6ff";
    ctx.beginPath();
    ctx.arc(rand() * CARD_WIDTH, rand() * CARD_HEIGHT, 0.8 + rand() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Frame
  ctx.strokeStyle = "rgba(227, 200, 143, 0.55)";
  ctx.lineWidth = 2;
  roundRect(ctx, 56, 56, CARD_WIDTH - 112, CARD_HEIGHT - 112, 36);
  ctx.stroke();

  // Brand
  const mark = await loadSvg(BRAND_MARK_SVG);
  ctx.font = `500 58px ${DISPLAY}`;
  setSpacing(ctx, 0);
  const brand = "MysticPalm";
  const brandW = ctx.measureText(brand).width;
  const groupW = 64 + 18 + brandW;
  ctx.drawImage(mark, cx - groupW / 2, 150, 64, 64);
  ctx.fillStyle = "#f4efff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(brand, cx - groupW / 2 + 82, 184);

  // Eyebrow
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `600 26px ${SANS}`;
  setSpacing(ctx, 8);
  ctx.fillStyle = "#e3c88f";
  ctx.fillText("MY PALM PROFILE", cx, 340);
  setSpacing(ctx, 0);

  // Title
  ctx.font = `500 128px ${DISPLAY}`;
  const titleLines = wrap(ctx, title, CARD_WIDTH - 220);
  const titleGrad = ctx.createLinearGradient(0, 380, 0, 380 + titleLines.length * 128);
  titleGrad.addColorStop(0, "#ffffff");
  titleGrad.addColorStop(1, "#c9b8ff");
  ctx.fillStyle = titleGrad;
  titleLines.forEach((l, i) => ctx.fillText(l, cx, 480 + i * 126));
  const afterTitle = 480 + (titleLines.length - 1) * 126;

  // Tagline
  ctx.font = `italic 500 52px ${DISPLAY}`;
  ctx.fillStyle = "#d4c6ff";
  wrap(ctx, tagline, CARD_WIDTH - 260).forEach((l, i) => ctx.fillText(l, cx, afterTitle + 96 + i * 60));

  // Orbit + hand
  const handTop = 820;
  ctx.strokeStyle = "rgba(201, 184, 255, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, handTop + 340, 380, 380, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#e3c88f";
  ctx.beginPath();
  ctx.arc(cx + 380 * Math.cos(-0.5), handTop + 340 + 380 * Math.sin(-0.5), 6, 0, Math.PI * 2);
  ctx.fill();

  const hand = await loadSvg(handSvgString({ highlight: PALM_LINE_ORDER, size: 520 }));
  ctx.drawImage(hand, cx - 260, handTop - 40, 520, 728);

  // Footer copy
  ctx.font = `500 54px ${DISPLAY}`;
  ctx.fillStyle = "#f4efff";
  ctx.fillText("Your hands have a story.", cx, 1610);
  ctx.font = `italic 500 54px ${DISPLAY}`;
  ctx.fillStyle = "#e3c88f";
  ctx.fillText("What's yours?", cx, 1676);

  ctx.font = `400 24px ${SANS}`;
  ctx.fillStyle = "rgba(167, 159, 198, 0.95)";
  ctx.fillText("For entertainment & self-reflection only. Not a scientific prediction.", cx, 1772);
  ctx.font = `600 22px ${SANS}`;
  setSpacing(ctx, 5);
  ctx.fillStyle = "rgba(167, 159, 198, 0.7)";
  ctx.fillText("IDEAS 4.0 · OCT 27–28, 2026", cx, 1812);
  setSpacing(ctx, 0);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image"))), "image/png"),
  );
}
