"use client";

import { useId, type KeyboardEvent } from "react";
import { HAND_DETAILS, HAND_OUTLINE, LINE_COLORS, PALM_LINES, seeded } from "@/lib/hand-geometry";
import { PALM_LINES_CONTENT, type LineId } from "@/lib/palm-data";

type Variant = "hero" | "interactive" | "static";

interface PalmIllustrationProps {
  variant?: Variant;
  /** Line currently in focus — drawn brightest with a travelling shimmer. */
  selected?: LineId | null;
  /** Lines drawn in their signature colour (others fall back to faint gold). */
  highlighted?: LineId[];
  onSelect?: (id: LineId) => void;
  className?: string;
  /** Accessible title for non-interactive variants. */
  title?: string;
}

const PARTICLES = (() => {
  const rand = seeded(27);
  return Array.from({ length: 46 }, () => ({
    x: -40 + rand() * 480,
    y: -10 + rand() * 560,
    r: 0.6 + rand() * 1.6,
    delay: rand() * 4,
    gold: rand() > 0.82,
  }));
})();

export function PalmIllustration({
  variant = "static",
  selected = null,
  highlighted = [],
  onSelect,
  className,
  title = "Illustrated palm showing the heart, head, life and fate lines",
}: PalmIllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const interactive = variant === "interactive" && !!onSelect;
  const hero = variant === "hero";

  const viewBox = hero ? "-70 -20 540 600" : "20 30 360 540";

  const handleKey = (e: KeyboardEvent<SVGGElement>, lineId: LineId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(lineId);
    }
  };

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={interactive ? "group" : "img"}
      aria-label={interactive ? "Interactive palm. Choose a line to explore." : title}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={id("skin")} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#8f74ec" stopOpacity="0.62" />
          <stop offset="0.5" stopColor="#4b2fa3" stopOpacity="0.55" />
          <stop offset="0.92" stopColor="#1a1036" stopOpacity="0.15" />
          <stop offset="1" stopColor="#1a1036" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("palmlight")} cx="0.56" cy="0.58" r="0.38">
          <stop offset="0" stopColor="#d4c6ff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#d4c6ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1ebff" />
          <stop offset="0.75" stopColor="#9d7bff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#9d7bff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("halo")} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#6d4ae0" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#6d4ae0" stopOpacity="0.08" />
          <stop offset="1" stopColor="#6d4ae0" stopOpacity="0" />
        </radialGradient>
        <filter id={id("glow")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={id("soft")} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id={id("clip")}>
          <path d={HAND_OUTLINE} />
        </clipPath>
      </defs>

      {hero && (
        <g aria-hidden="true">
          <ellipse cx="200" cy="300" rx="250" ry="270" fill={`url(#${id("halo")})`} />
          <g className="orbit">
            <ellipse cx="200" cy="290" rx="232" ry="232" fill="none" stroke="#c9b8ff" strokeOpacity="0.16" strokeWidth="0.8" />
            <circle cx="432" cy="290" r="2.6" fill="#e3c88f" />
          </g>
          <ellipse cx="200" cy="290" rx="196" ry="196" fill="none" stroke="#c9b8ff" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="2 6" />
          {PARTICLES.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill={p.gold ? "#e3c88f" : "#d4c6ff"}
              className="twinkle"
              style={{ animationDelay: `${p.delay}s` }}
            />
          ))}
        </g>
      )}

      {/* Hand body */}
      <g aria-hidden="true">
        {hero && <path d={HAND_OUTLINE} fill="#6d4ae0" opacity="0.35" filter={`url(#${id("soft")})`} />}
        <path d={HAND_OUTLINE} fill={`url(#${id("skin")})`} />
        <path d={HAND_OUTLINE} fill={`url(#${id("palmlight")})`} />
        <g clipPath={`url(#${id("clip")})`}>
          {HAND_DETAILS.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#d4c6ff" strokeOpacity="0.2" strokeWidth="1.3" strokeLinecap="round" />
          ))}
        </g>
        <path d={HAND_OUTLINE} fill="none" stroke={`url(#${id("rim")})`} strokeWidth="1.8" strokeLinejoin="round" />
      </g>

      {/* Palm lines */}
      {PALM_LINES.map((line) => {
        const isSelected = selected === line.id;
        const isLit = isSelected || highlighted.includes(line.id);
        const color = isLit ? LINE_COLORS[line.id] : "#e3c88f";
        const name = PALM_LINES_CONTENT[line.id].name;

        const visual = (
          <>
            <path
              d={line.d}
              fill="none"
              stroke={color}
              strokeWidth={isSelected ? 4.2 : isLit ? 3 : 2.2}
              strokeLinecap="round"
              opacity={isSelected ? 1 : isLit ? 0.85 : hero ? 0.7 : 0.45}
              filter={isLit ? `url(#${id("glow")})` : undefined}
              style={{ transition: "stroke 400ms ease, stroke-width 400ms ease, opacity 400ms ease" }}
            />
            {isSelected && (
              <path
                d={line.d}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.75"
                className="line-flow"
              />
            )}
          </>
        );

        if (!interactive) return <g key={line.id} aria-hidden="true">{visual}</g>;

        return (
          <g
            key={line.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`${name}${isSelected ? " (selected)" : ""}`}
            onClick={() => onSelect?.(line.id)}
            onKeyDown={(e) => handleKey(e, line.id)}
            className="group cursor-pointer outline-none"
          >
            {/* Generous invisible hit area so lines are easy to tap */}
            <path d={line.d} fill="none" stroke="transparent" strokeWidth="26" strokeLinecap="round" />
            <g className="transition-opacity duration-300 group-hover:opacity-100">{visual}</g>
            <path
              d={line.d}
              fill="none"
              stroke={LINE_COLORS[line.id]}
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0"
              className="transition-opacity duration-300 group-hover:opacity-20 group-focus-visible:opacity-45"
            />
          </g>
        );
      })}
    </svg>
  );
}
