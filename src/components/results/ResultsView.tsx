"use client";

import { Compass, RotateCcw, Share2, Undo2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { PalmIllustration } from "@/components/hand/PalmIllustration";
import { ShareDialog } from "@/components/share/ShareDialog";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LINE_COLORS } from "@/lib/hand-geometry";
import { ARCHETYPE_ORDER, ARCHETYPES, PALM_LINE_ORDER, PALM_LINES_CONTENT, type LineId } from "@/lib/palm-data";
import { composeReading, POINTS_PER_EXPLORED_LINE, POINTS_PER_REFLECTION, type Answers } from "@/lib/reading";

const ease = [0.22, 1, 0.36, 1] as const;

interface ResultsViewProps {
  answers: Answers;
  explored: LineId[];
  onExploreAgain: () => void;
  onStartOver: () => void;
}

export function ResultsView({ answers, explored, onExploreAgain, onStartOver }: ResultsViewProps) {
  const reading = useMemo(() => composeReading(answers, explored), [answers, explored]);
  const [shareOpen, setShareOpen] = useState(false);
  const { archetype, discovery } = reading;
  const answeredLines = PALM_LINE_ORDER.filter((id) => answers[id]);

  return (
    <div className="pb-24">
      {/* Profile header */}
      <section
        aria-labelledby="profile-title"
        className="relative bg-[radial-gradient(38rem_26rem_at_80%_20rem,rgba(109,74,224,0.28),transparent_72%)]"
      >
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-4 md:grid-cols-12 md:px-10 md:pt-8">
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold"
            >
              Your palm profile
            </motion.p>
            <motion.h1
              id="profile-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.02em] text-balance"
            >
              <span className="mb-2 block text-[0.4em] font-normal italic leading-none text-lavender">The</span>
              {archetype.title.replace(/^The /, "")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-3 font-display text-2xl italic text-lavender md:text-3xl"
            >
              {archetype.tagline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="mt-6 max-w-xl leading-relaxed text-mist text-pretty"
            >
              {archetype.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <DiscoveryRing score={discovery.score} />
              <div className="max-w-xs">
                <p className="font-semibold">Your Discovery Level</p>
                <p className="mt-1 text-sm text-mist">
                  {discovery.explored} of 4 lines explored · {discovery.answered} of 4 reflections answered
                </p>
                <p className="mt-2 text-xs leading-relaxed text-haze">
                  Exploration progress — {POINTS_PER_EXPLORED_LINE} points per line opened, {POINTS_PER_REFLECTION} per
                  reflection. Not a measure of personality, intelligence, or destiny.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Button onClick={() => setShareOpen(true)}>
                <Share2 size={16} aria-hidden="true" /> Share My Reading
              </Button>
              <Button tone="ghost" onClick={onExploreAgain}>
                <Undo2 size={16} aria-hidden="true" /> Explore Again
              </Button>
              <Button tone="quiet" onClick={onStartOver}>
                <RotateCcw size={16} aria-hidden="true" /> Start Over
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease }}
            className="relative mx-auto w-full max-w-[20rem] md:col-span-5 md:max-w-[26rem]"
          >
            <PalmIllustration
              variant="hero"
              highlighted={answeredLines.length ? answeredLines : PALM_LINE_ORDER}
              title={`Palm illustration with the ${(answeredLines.length ? answeredLines : PALM_LINE_ORDER).join(", ")} lines highlighted`}
              className="h-auto w-full"
            />
          </motion.div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl px-5 md:px-10">
          <details className="group max-w-3xl rounded-2xl border border-line bg-plum/30 px-5 py-4 open:pb-6">
            <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-paper [&::-webkit-details-marker]:hidden">
              Why “{archetype.title}”?
              <span aria-hidden="true" className="text-lavender transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-mist">
              <p>
                Your title comes only from the reflection answers you chose — not from your photo. Each answer adds points
                to one or two profiles; the profile with the most points wins.
              </p>
              {reading.contributions.length ? (
                <ul className="space-y-1">
                  {reading.contributions.map((c) => (
                    <li key={c.lineId}>
                      <span style={{ color: LINE_COLORS[c.lineId] }}>{PALM_LINES_CONTENT[c.lineId].name}</span> — “{c.answerLabel}”
                      adds +{c.points}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You skipped the reflections, so you received our default profile — The Curious Explorer. Answer a few to see it change.</p>
              )}
              <ul className="flex flex-wrap gap-2 pt-1" aria-label="Points per profile">
                {ARCHETYPE_ORDER.map((id) => (
                  <li
                    key={id}
                    className={`rounded-full border px-3 py-1 text-xs ${id === archetype.id ? "border-gold/60 text-gold" : "border-line text-haze"}`}
                  >
                    {ARCHETYPES[id].title.replace("The ", "")}: {reading.scores[id]}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </section>

      {/* Four lines */}
      <section aria-labelledby="lines-title" className="mx-auto mt-24 max-w-7xl px-5 md:mt-32 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="lines-title" className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-medium leading-none">
            Your four <em className="text-lavender">lines</em>
          </h2>
          <p className="max-w-xs text-sm text-haze">Traditional interpretations, shaped by what you chose.</p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-12">
          {reading.lines.map((line, i) => {
            const wide = i === 0 || i === 3;
            return (
              <Reveal
                as="article"
                key={line.lineId}
                delay={(i % 2) * 0.08}
                className={`relative bg-night p-7 md:p-10 ${wide ? "md:col-span-7" : "md:col-span-5"}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em]" style={{ color: LINE_COLORS[line.lineId] }}>
                      {line.keywords}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-medium md:text-4xl">{line.name}</h3>
                  </div>
                  <MiniLine id={line.lineId} />
                </div>
                <p className={`mt-5 leading-relaxed text-mist ${wide ? "md:text-lg" : ""}`}>{line.reading}</p>
                <p className="mt-5 text-xs text-haze">
                  {line.answer ? (
                    <>
                      You chose: <span className="text-paper">{line.answer.label}</span>
                    </>
                  ) : (
                    "Reflection skipped"
                  )}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Reflections + adventure */}
      <section className="mx-auto mt-24 grid max-w-7xl gap-6 px-5 md:mt-32 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-5">
          <h2 className="font-display text-3xl md:text-4xl">Your reflections</h2>
          {answeredLines.length ? (
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {reading.lines.map((line) => (
                <li key={line.lineId} className="flex items-baseline justify-between gap-4 py-4 text-sm">
                  <span className="text-haze">{PALM_LINES_CONTENT[line.lineId].question}</span>
                  <span className="shrink-0 text-right text-paper">{line.answer?.label ?? "—"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-mist">You explored without answering — that&apos;s a perfectly good way to travel. Choose “Explore Again” to add your reflections.</p>
          )}
          <p className="mt-4 text-xs text-haze">Your answers are not saved anywhere and disappear when you start over.</p>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/30 bg-gradient-to-br from-plum to-night p-7 md:p-10">
            <Compass aria-hidden="true" className="absolute -right-6 -top-6 h-32 w-32 text-gold/10" strokeWidth={1} />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">Your next adventure</p>
            <ol className="mt-6 space-y-6">
              {reading.adventures.map((a, i) => (
                <li key={a.title} className="flex gap-5">
                  <span className="font-display text-3xl italic text-gold/70">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl">{a.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <p className="mx-auto mt-20 max-w-2xl px-5 text-center text-xs leading-relaxed text-haze">
        MysticPalm is for entertainment and self-reflection. Palmistry is a cultural tradition, not a scientifically
        validated method of prediction, and nothing here describes your future.
      </p>

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} title={archetype.title} tagline={archetype.tagline} />
    </div>
  );
}

function DiscoveryRing({ score }: { score: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`Discovery level ${score} out of 100`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(201,184,255,0.12)" strokeWidth="5" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.6, delay: 0.6, ease }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e3c88f" />
            <stop offset="1" stopColor="#9d7bff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center" aria-hidden="true">
        <span>
          <span className="block font-display text-4xl leading-none">{score}</span>
          <span className="text-[0.65rem] text-haze">/ 100</span>
        </span>
      </span>
    </div>
  );
}

function MiniLine({ id }: { id: LineId }) {
  const paths: Record<LineId, string> = {
    heart: "M4 20 C 16 24, 30 24, 44 10",
    head: "M4 12 C 18 16, 32 20, 44 30",
    life: "M8 4 C 30 14, 30 30, 20 44",
    fate: "M24 44 C 24 30, 22 18, 20 4",
  };
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" aria-hidden="true" fill="none">
      <circle cx="24" cy="24" r="23" stroke="rgba(201,184,255,0.15)" />
      <path d={paths[id]} stroke={LINE_COLORS[id]} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
