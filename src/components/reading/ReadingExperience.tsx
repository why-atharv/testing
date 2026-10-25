"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useReducer, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { ResultsView } from "@/components/results/ResultsView";
import { MotionToggle } from "@/components/ui/MotionPreference";
import { CameraCapture } from "./CameraCapture";
import { ImageUpload } from "./ImageUpload";
import { PalmExplorer } from "./PalmExplorer";
import { ReadingIntro } from "./ReadingIntro";
import { initialReadingState, readingReducer, type Stage } from "./state";
import { usePhotoUrl } from "./usePhotoUrl";

const STAGE_LABEL: Record<Stage, string> = {
  intro: "Begin",
  camera: "Live palm scan",
  upload: "Upload your palm",
  explore: "Explore the lines",
  results: "Your reading",
};

const BACK_TO: Record<Stage, Stage | null> = {
  intro: null,
  camera: "intro",
  upload: "intro",
  explore: "intro",
  results: "explore",
};

export function ReadingExperience() {
  const [state, dispatch] = useReducer(readingReducer, initialReadingState);
  const photoUrl = usePhotoUrl(state.photo);
  const firstStage = useRef(true);

  useEffect(() => {
    if (firstStage.current) {
      firstStage.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [state.stage]);

  const go = (stage: Stage) => dispatch({ type: "go", stage });
  const back = BACK_TO[state.stage];

  return (
    <div className="sky min-h-[100svh]">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-10">
          <div className="flex items-center gap-2 md:gap-6">
            {back ? (
              <button
                type="button"
                onClick={() => go(back)}
                className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-mist hover:text-paper"
              >
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
            ) : (
              <Link href="/" className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-mist hover:text-paper">
                <ArrowLeft size={16} aria-hidden="true" /> Home
              </Link>
            )}
            <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block" />
            <Logo className="hidden sm:inline-flex" />
          </div>
          <p className="hidden text-xs uppercase tracking-[0.24em] text-haze lg:block">{STAGE_LABEL[state.stage]}</p>
          <MotionToggle compact />
        </div>
      </header>

      <main id="main" tabIndex={-1} className="pt-8 outline-none md:pt-12">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.stage}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {state.stage === "intro" && <ReadingIntro onChoose={go} />}
              {state.stage === "camera" && (
                <CameraCapture
                  onUse={(photo) => {
                    dispatch({ type: "setPhoto", photo, source: "camera" });
                    go("explore");
                  }}
                  onUpload={() => go("upload")}
                  onManual={() => go("explore")}
                />
              )}
              {state.stage === "upload" && (
                <ImageUpload
                  onUse={(photo) => {
                    dispatch({ type: "setPhoto", photo, source: "upload" });
                    go("explore");
                  }}
                />
              )}
              {state.stage === "explore" && (
                <PalmExplorer
                  state={state}
                  photoUrl={photoUrl}
                  onSelect={(line) => dispatch({ type: "select", line })}
                  onAnswer={(line, optionId) => dispatch({ type: "answer", line, optionId })}
                  onFinish={() => go("results")}
                />
              )}
              {state.stage === "results" && (
                <ResultsView
                  answers={state.answers}
                  explored={state.explored}
                  onExploreAgain={() => go("explore")}
                  onStartOver={() => dispatch({ type: "reset" })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </div>
  );
}
