"use client";

import { Camera, Hand, ShieldCheck, Upload } from "lucide-react";
import { motion } from "motion/react";
import type { Stage } from "./state";

const OPTIONS: {
  stage: Stage;
  title: string;
  body: string;
  cta: string;
  Icon: typeof Camera;
}[] = [
  {
    stage: "camera",
    title: "Live Palm Scan",
    body: "Use your camera to take a photo of your palm, guided by an on-screen outline.",
    cta: "Open camera",
    Icon: Camera,
  },
  {
    stage: "upload",
    title: "Upload Your Palm",
    body: "Choose a clear photo of your open palm from your device.",
    cta: "Choose a photo",
    Icon: Upload,
  },
  {
    stage: "explore",
    title: "Explore Manually",
    body: "Go straight to the illustrated hand and discover each line at your own pace. No photo needed.",
    cta: "Start exploring",
    Icon: Hand,
  },
];

export function ReadingIntro({ onChoose }: { onChoose: (stage: Stage) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:px-10 md:pt-10">
      <div className="text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">Begin your reading</p>
        <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,5.4rem)] font-medium leading-[0.95] text-balance">
          Let&apos;s Discover <em className="text-lavender">Your Palm.</em>
        </h1>
        <p className="mt-5 text-mist">Choose how you&apos;d like to begin your journey.</p>
      </div>

      <ul className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
        {OPTIONS.map(({ stage, title, body, cta, Icon }, i) => (
          <motion.li
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => onChoose(stage)}
              className="group relative flex h-full w-full flex-col items-start overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-b from-plum/80 to-night p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-lavender/40 hover:shadow-[0_30px_80px_-40px_rgba(157,123,255,0.7)] md:min-h-[22rem] md:p-8"
            >
              <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet/10 blur-2xl transition-opacity duration-500 group-hover:bg-violet/25" />
              <span className="flex w-full items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-lavender/30 text-lavender transition-colors group-hover:border-lavender/70 group-hover:text-white">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="font-display text-lg italic text-haze">0{i + 1}</span>
              </span>
              <span className="mt-8 font-display text-3xl font-medium md:mt-auto">{title}</span>
              <span className="mt-3 text-sm leading-relaxed text-mist">{body}</span>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-lavender transition-colors group-hover:text-white">
                {cta}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <p className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-3 text-center text-xs leading-relaxed text-haze">
        <ShieldCheck size={16} className="mt-px shrink-0 text-gold" aria-hidden="true" />
        <span>
          Camera access requires your permission. Photos are kept in your browser&apos;s memory only — never uploaded,
          never stored, and discarded when you start over. MysticPalm does not analyse photos automatically; a photo is a
          visual reference you can compare with the illustrated hand.
        </span>
      </p>
    </div>
  );
}
