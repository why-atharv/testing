"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PalmIllustration } from "@/components/hand/PalmIllustration";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LINE_COLORS } from "@/lib/hand-geometry";
import { PALM_LINE_ORDER, PALM_LINES_CONTENT, type LineId } from "@/lib/palm-data";

export function DiscoveryPreview() {
  const [selected, setSelected] = useState<LineId>("heart");
  const line = PALM_LINES_CONTENT[selected];

  return (
    <section id="discover" aria-labelledby="discover-title" className="relative scroll-mt-20 overflow-hidden bg-night py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-violet-deep/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-12">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">Try it now</p>
          <h2 id="discover-title" className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1] text-balance">
            Touch a line. <em className="text-lavender">Hear its legend.</em>
          </h2>
        </Reveal>

        <Reveal className="relative md:col-span-6 lg:col-span-5 lg:col-start-2">
          <div className="relative mx-auto max-w-[24rem]">
            <div aria-hidden="true" className="absolute inset-8 rounded-full bg-violet/10 blur-3xl" />
            <PalmIllustration
              variant="interactive"
              selected={selected}
              highlighted={PALM_LINE_ORDER}
              onSelect={setSelected}
              className="relative h-auto w-full"
            />
          </div>
          <p className="mt-2 text-center text-xs text-haze">Tap or use Tab + Enter to select a line on the hand.</p>
        </Reveal>

        <div className="md:col-span-6 md:self-center lg:col-span-5 lg:col-start-8">
          <div role="tablist" aria-label="Palm lines" className="flex flex-wrap gap-2">
            {PALM_LINE_ORDER.map((id) => {
              const active = id === selected;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  aria-controls="discover-panel"
                  onClick={() => setSelected(id)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                    active ? "border-lavender/60 bg-lavender/10 text-paper" : "border-line text-mist hover:text-paper"
                  }`}
                >
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: LINE_COLORS[id] }} />
                  {PALM_LINES_CONTENT[id].name}
                </button>
              );
            })}
          </div>

          <div id="discover-panel" role="tabpanel" aria-live="polite" className="mt-10 min-h-[19rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: LINE_COLORS[selected] }}>
                  {line.keywords}
                </p>
                <h3 className="mt-3 font-display text-4xl font-medium md:text-5xl">{line.name}</h3>
                <p className="mt-2 font-display text-2xl italic text-lavender">{line.subtitle}</p>
                <p className="mt-6 leading-relaxed text-mist">{line.tradition}</p>
                <p className="mt-4 border-l border-gold/40 pl-4 text-sm leading-relaxed text-haze">
                  <span className="font-semibold text-gold">Where to look · </span>
                  {line.location}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <ButtonLink href="/reading" tone="ghost" className="mt-4">
            Begin the full reading
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
