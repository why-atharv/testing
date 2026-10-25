"use client";

import { ArrowRight, Check, Image as ImageIcon, Hand } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PalmIllustration } from "@/components/hand/PalmIllustration";
import { Button } from "@/components/ui/Button";
import { LINE_COLORS } from "@/lib/hand-geometry";
import { PALM_LINE_ORDER, PALM_LINES_CONTENT, type LineId } from "@/lib/palm-data";
import { nextLine, type ReadingState } from "./state";

interface PalmExplorerProps {
  state: ReadingState;
  photoUrl: string | null;
  onSelect: (line: LineId) => void;
  onAnswer: (line: LineId, optionId: string | undefined) => void;
  onFinish: () => void;
}

export function PalmExplorer({ state, photoUrl, onSelect, onAnswer, onFinish }: PalmExplorerProps) {
  const { current, answers, explored } = state;
  const line = PALM_LINES_CONTENT[current];
  const color = LINE_COLORS[current];
  const upcoming = nextLine(state, current);
  const [view, setView] = useState<"illustration" | "photo">("illustration");
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus to the panel heading when the line changes so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    panelHeading.current?.focus({ preventScroll: true });
  }, [current]);

  const goNext = () => {
    if (upcoming) {
      onSelect(upcoming);
      if (window.innerWidth < 1024) document.getElementById("explorer-top")?.scrollIntoView({ block: "start" });
    } else onFinish();
  };

  const stepIndex = PALM_LINE_ORDER.indexOf(current);

  return (
    <div id="explorer-top" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 md:px-10">
      <h1 className="sr-only">Explore your palm lines</h1>

      {/* Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-mist" aria-live="polite">
          <span className="font-semibold text-paper">Line {stepIndex + 1} of 4</span>
          <span className="mx-2 text-haze">·</span>
          {explored.length} explored, {PALM_LINE_ORDER.filter((id) => answers[id]).length} reflected
        </p>
        <div
          className="flex items-center gap-2"
          role="progressbar"
          aria-label="Lines explored"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={explored.length}
        >
          {PALM_LINE_ORDER.map((id) => (
            <span key={id} className="relative h-1 w-10 overflow-hidden rounded-full bg-line md:w-14">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: LINE_COLORS[id] }}
                initial={false}
                animate={{ width: explored.includes(id) ? "100%" : "0%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-8">
        {/* Line rail */}
        <nav aria-label="Palm lines" className="min-w-0 lg:col-span-2">
          <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {PALM_LINE_ORDER.map((id) => {
              const active = id === current;
              const done = !!answers[id];
              return (
                <li key={id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    aria-current={active ? "step" : undefined}
                    className={`relative flex min-h-11 w-full items-center gap-3 rounded-full border px-4 text-sm transition-colors lg:rounded-xl ${
                      active ? "border-lavender/50 bg-lavender/10 text-paper" : "border-transparent text-mist hover:text-paper"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-5 w-5 place-items-center rounded-full"
                      style={{ background: done || active ? LINE_COLORS[id] : "transparent", border: `1.5px solid ${LINE_COLORS[id]}` }}
                    >
                      {done && <Check size={12} strokeWidth={3} className="text-ink" />}
                    </span>
                    {PALM_LINES_CONTENT[id].name}
                    {done && <span className="sr-only">(reflected)</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {photoUrl && (
            <div className="mt-4 hidden lg:block">
              <p className="mb-2 text-[0.7rem] uppercase tracking-[0.2em] text-haze">Your reference</p>
              <motion.img
                layoutId="palm-photo"
                src={photoUrl}
                alt="Your palm photo, used as a visual reference"
                className="aspect-square w-full rounded-xl border border-line object-cover"
              />
            </div>
          )}
        </nav>

        {/* Hand */}
        <div className="relative lg:col-span-5">
          {photoUrl && (
            <div role="group" aria-label="View" className="mb-4 inline-flex rounded-full border border-line p-1 text-sm">
              {(
                [
                  ["illustration", "Illustration", Hand],
                  ["photo", "My photo", ImageIcon],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={view === value}
                  onClick={() => setView(value)}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 transition-colors ${
                    view === value ? "bg-lavender/15 text-paper" : "text-mist hover:text-paper"
                  }`}
                >
                  <Icon size={14} aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          )}

          <div className="relative mx-auto max-w-[19rem] sm:max-w-[23rem] lg:max-w-none">
            <div aria-hidden="true" className="absolute inset-10 rounded-full blur-3xl transition-colors duration-700" style={{ background: `${color}22` }} />
            {view === "photo" && photoUrl ? (
              <figure className="relative">
                {/* Local blob URL — next/image optimisation doesn't apply */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Your palm photo" className="aspect-[3/4] w-full rounded-[1.5rem] border border-line object-cover" />
                <figcaption className="mt-3 text-xs leading-relaxed text-mist">
                  <span className="font-semibold" style={{ color }}>Finding the {line.name.toLowerCase()}: </span>
                  {line.location} MysticPalm doesn&apos;t detect lines automatically — compare by eye.
                </figcaption>
              </figure>
            ) : (
              <PalmIllustration
                variant="interactive"
                selected={current}
                highlighted={explored}
                onSelect={onSelect}
                className="relative h-auto w-full"
              />
            )}
          </div>
        </div>

        {/* Panel */}
        <section aria-labelledby="line-heading" className="lg:col-span-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.75rem] border border-line bg-gradient-to-b from-plum/70 to-night/80 p-6 md:p-9"
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em]" style={{ color }}>
                {line.name}
              </p>
              <h2 id="line-heading" ref={panelHeading} tabIndex={-1} className="mt-3 font-display text-4xl font-medium leading-tight outline-none md:text-5xl">
                {line.subtitle}
              </h2>
              <p className="mt-5 leading-relaxed text-mist">{line.tradition}</p>
              <p className="mt-3 text-sm leading-relaxed text-haze">{line.location}</p>

              <fieldset className="mt-8">
                <legend className="text-sm font-semibold text-paper">
                  <span className="mr-2 text-gold" aria-hidden="true">✦</span>
                  Your reflection
                </legend>
                <p className="mt-2 font-display text-2xl italic leading-snug text-lavender">{line.question}</p>
                <div className="mt-5 grid gap-2">
                  {line.options.map((option) => {
                    const checked = answers[current] === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lavender ${
                          checked ? "border-lavender/60 bg-lavender/10 text-paper" : "border-line text-mist hover:border-lavender/30 hover:text-paper"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`reflection-${current}`}
                          value={option.id}
                          checked={checked}
                          onChange={() => onAnswer(current, option.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors"
                          style={{ borderColor: checked ? color : "rgba(201,184,255,0.35)" }}
                        >
                          <span className="h-2.5 w-2.5 rounded-full transition-transform" style={{ background: color, transform: checked ? "scale(1)" : "scale(0)" }} />
                        </span>
                        {option.label}
                      </label>
                    );
                  })}
                </div>
                {answers[current] && (
                  <button type="button" onClick={() => onAnswer(current, undefined)} className="mt-3 text-xs text-haze underline-offset-4 hover:text-paper hover:underline">
                    Clear my answer
                  </button>
                )}
              </fieldset>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-haze">{answers[current] ? "Answer saved." : "Answering is optional."}</p>
                <Button onClick={goNext}>
                  {upcoming ? `Continue to ${PALM_LINES_CONTENT[upcoming].name}` : "Reveal My Reading"}
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
