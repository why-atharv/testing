"use client";

import { ArrowDown } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { PalmIllustration } from "@/components/hand/PalmIllustration";
import { ButtonLink } from "@/components/ui/Button";
import { useMotionPreference } from "@/components/ui/MotionPreference";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { reduced } = useMotionPreference();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const handX = useTransform(sx, (v) => v * 14);
  const handY = useTransform(sy, (v) => v * 10);
  const rotate = useTransform(sx, (v) => v * 2);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      mx.set(0);
      my.set(0);
    };
  }, [reduced, mx, my]);

  return (
    <section aria-labelledby="hero-title" className="sky relative isolate overflow-hidden">
      {/* horizon */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-plum" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path d="M0 120 C 240 80 420 110 620 92 C 840 72 1040 118 1240 96 C 1340 86 1400 92 1440 96 L1440 160 L0 160Z" fill="currentColor" opacity="0.7" />
        <path d="M0 140 C 300 110 520 140 760 124 C 1000 108 1200 142 1440 126 L1440 160 L0 160Z" fill="#06040d" />
      </svg>

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-4 px-5 pb-20 pt-20 md:grid-cols-12 md:gap-6 md:px-10 md:pt-24">
        <div className="relative z-10 order-2 md:order-1 md:col-span-6 lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold"
          >
            <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
            An experience in self-discovery
          </motion.p>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mt-6 font-display text-[clamp(3.2rem,8.5vw,7rem)] font-medium leading-[0.92] tracking-[-0.02em] text-balance"
          >
            <span className="block bg-gradient-to-b from-[#f6f1ff] to-[#c9b8ff] bg-clip-text text-transparent">Your Hands</span>
            <span className="block bg-gradient-to-b from-[#f6f1ff] to-[#c9b8ff] bg-clip-text text-transparent">
              Have a <em className="font-normal">Story</em>
              <span className="text-gold">.</span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="mt-7 max-w-md text-base leading-relaxed text-mist md:text-lg text-pretty"
          >
            Every line has a legend. Every detail invites a question. Explore the fascinating world of palmistry and
            discover a new perspective on yourself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/reading">Discover My Palm</ButtonLink>
            <ButtonLink href="#how-it-works" tone="ghost">
              Explore the Experience
            </ButtonLink>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 text-xs text-haze"
          >
            An interactive palmistry experience for curiosity, reflection, and fun.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
          className="relative order-1 mx-auto -mb-4 w-full max-w-[13.5rem] sm:max-w-[22rem] md:order-2 md:col-span-6 md:max-w-none lg:col-span-6"
        >
          <motion.div style={{ x: handX, y: handY, rotate }} className="drift">
            <PalmIllustration variant="hero" highlighted={["heart"]} className="h-auto w-full" />
          </motion.div>
          <p className="absolute bottom-[12%] right-0 hidden max-w-[11rem] border-l border-gold/40 pl-3 text-[0.7rem] leading-relaxed text-mist lg:block">
            <span className="block font-semibold uppercase tracking-[0.2em] text-gold">Heart line</span>
            Traditionally read as the language of emotion.
          </p>
        </motion.div>
      </div>

      <a
        href="#how-it-works"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-haze transition-colors hover:text-paper md:flex"
      >
        <ArrowDown size={16} aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}
