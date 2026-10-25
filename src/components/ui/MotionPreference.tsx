"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Motion preference: follows the operating system by default, with an
 * in-product override. Only this non-sensitive preference is persisted.
 */
type Pref = "system" | "reduce";

interface MotionPrefContext {
  reduced: boolean;
  pref: Pref;
  toggle: () => void;
}

const Ctx = createContext<MotionPrefContext>({ reduced: false, pref: "system", toggle: () => {} });
const KEY = "mysticpalm:motion";

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<Pref>("system");
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "reduce") setPref("reduce");
    } catch {
      /* storage unavailable — fall back to system preference */
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = pref === "reduce" ? "reduce" : "full";
  }, [pref]);

  const toggle = useCallback(() => {
    setPref((p) => {
      const next = p === "reduce" ? "system" : "reduce";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reduced = pref === "reduce" || systemReduced;

  return (
    <Ctx.Provider value={{ reduced, pref, toggle }}>
      <MotionConfig reducedMotion={pref === "reduce" ? "always" : "user"}>{children}</MotionConfig>
    </Ctx.Provider>
  );
}

export const useMotionPreference = () => useContext(Ctx);

export function MotionToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { pref, toggle } = useMotionPreference();
  const on = pref === "reduce";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap text-sm text-mist transition-colors hover:text-paper ${className}`}
    >
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-full border transition-colors ${on ? "border-violet bg-violet/40" : "border-line bg-plum"}`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-paper transition-transform duration-300 ${on ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </span>
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>Reduce motion</span>
    </button>
  );
}
