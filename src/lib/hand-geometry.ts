import type { LineId } from "./palm-data";

/**
 * Geometry for the MysticPalm hand illustration.
 * A left palm seen face-on, drawn in a 400 × 560 coordinate space.
 * Shared by the React illustration and the canvas share-card renderer
 * so every hand in the product is the same hand.
 */

export const HAND_VIEWBOX = { width: 400, height: 560 } as const;

export const HAND_OUTLINE = [
  "M152 560",
  "C150 512 142 474 128 446",
  // thumb, outer edge
  "C104 418 82 388 68 352",
  "C58 326 54 300 60 284",
  // thumb tip
  "C66 266 88 262 98 278",
  // thumb, inner edge back to the web
  "C108 294 114 314 124 326",
  "C130 304 128 274 124 248",
  // index finger
  "L120 124",
  "C119 101 130 90 141 90",
  "C153 90 162 100 162 121",
  "L172 210",
  "Q176 216 181 208",
  // middle finger
  "L184 82",
  "C184 61 195 52 205 52",
  "C216 52 226 61 226 82",
  "L228 206",
  "Q231 214 235 209",
  // ring finger
  "L243 104",
  "C245 84 256 77 265 78",
  "C276 80 285 90 282 108",
  "L276 222",
  "Q280 230 285 225",
  // little finger
  "L301 165",
  "C304 150 314 144 323 146",
  "C333 150 336 162 333 175",
  "L322 262",
  // outer palm edge down to the wrist
  "C333 302 332 380 320 430",
  "C310 470 298 510 294 560",
].join(" ");

/** Soft creases that give the illustration anatomy without stealing focus. */
export const HAND_DETAILS = [
  // finger joint creases
  "M122 178 Q141 184 162 176",
  "M119 140 Q140 146 161 139",
  "M182 160 Q205 166 228 159",
  "M182 118 Q205 124 228 117",
  "M243 172 Q262 178 280 170",
  "M247 132 Q265 138 283 130",
  "M301 210 Q315 214 328 207",
  "M305 184 Q318 188 331 182",
  // thumb crease
  "M74 326 Q88 316 104 314",
  // wrist bracelets
  "M156 528 Q222 540 292 526",
  "M154 546 Q222 558 293 544",
  // mounts beneath the fingers
  "M140 236 Q150 228 160 236",
  "M197 228 Q206 222 215 228",
  "M252 238 Q260 233 268 240",
];

export interface PalmLineGeometry {
  id: LineId;
  d: string;
  /** Point used to anchor a label near the line. */
  label: { x: number; y: number };
}

export const PALM_LINES: PalmLineGeometry[] = [
  {
    id: "heart",
    d: "M327 282 C298 290 268 296 246 290 C222 283 200 270 176 254",
    label: { x: 286, y: 276 },
  },
  {
    id: "head",
    d: "M126 300 C160 308 196 318 228 330 C258 341 284 354 304 372",
    label: { x: 250, y: 352 },
  },
  {
    id: "life",
    d: "M127 306 C160 326 182 368 180 412 C178 452 176 490 186 528",
    label: { x: 178, y: 452 },
  },
  {
    id: "fate",
    d: "M238 522 C234 470 230 420 226 372 C223 336 219 304 212 268",
    label: { x: 232, y: 460 },
  },
];

export const LINE_COLORS: Record<LineId, string> = {
  heart: "#f29ad6",
  head: "#8fdcc9",
  life: "#a3b6ff",
  fate: "#e8cb8c",
};

/** Deterministic pseudo-random generator so particle fields render identically on server and client. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Builds a standalone SVG string of the hand, used for rasterising the
 * share card on a canvas without depending on the DOM.
 */
export function handSvgString(options: { highlight?: LineId[]; size?: number } = {}) {
  const { highlight = [], size = 400 } = options;
  const h = Math.round((size / HAND_VIEWBOX.width) * HAND_VIEWBOX.height);
  const lines = PALM_LINES.map((line) => {
    const lit = highlight.includes(line.id);
    const color = lit ? LINE_COLORS[line.id] : "#e3c88f";
    return `<path d="${line.d}" fill="none" stroke="${color}" stroke-width="${lit ? 4 : 2.2}" stroke-linecap="round" opacity="${lit ? 1 : 0.55}" ${lit ? 'filter="url(#glow)"' : ""}/>`;
  }).join("");
  const details = HAND_DETAILS.map(
    (d) => `<path d="${d}" fill="none" stroke="#d4c6ff" stroke-opacity="0.22" stroke-width="1.4" stroke-linecap="round"/>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 400 560">
<defs>
<linearGradient id="skin" x1="0" y1="0" x2="0.3" y2="1">
<stop offset="0" stop-color="#8c72e8" stop-opacity="0.55"/>
<stop offset="0.55" stop-color="#4a2fa0" stop-opacity="0.5"/>
<stop offset="1" stop-color="#1a1036" stop-opacity="0"/>
</linearGradient>
<radialGradient id="palmlight" cx="0.56" cy="0.6" r="0.35">
<stop offset="0" stop-color="#c9b8ff" stop-opacity="0.35"/>
<stop offset="1" stop-color="#c9b8ff" stop-opacity="0"/>
</radialGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#e9e0ff"/>
<stop offset="0.8" stop-color="#9d7bff" stop-opacity="0.6"/>
<stop offset="1" stop-color="#9d7bff" stop-opacity="0"/>
</linearGradient>
<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<path d="${HAND_OUTLINE}" fill="url(#skin)"/>
<path d="${HAND_OUTLINE}" fill="url(#palmlight)"/>
${details}
${lines}
<path d="${HAND_OUTLINE}" fill="none" stroke="url(#rim)" stroke-width="2" stroke-linejoin="round"/>
</svg>`;
}
