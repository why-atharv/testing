"use client";

import { AlertCircle, Check, ImagePlus, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/Button";
import { usePhotoUrl } from "./usePhotoUrl";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

const GUIDELINES = ["Clear and well-lit", "Whole palm visible", "Fingers spread naturally", "No filters or heavy edits"];

async function canDecode(file: Blob): Promise<boolean> {
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file);
      bitmap.close();
      return true;
    } catch {
      return false;
    }
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}

export function ImageUpload({ onUse }: { onUse: (photo: Blob) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const url = usePhotoUrl(photo);

  const accept = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError(
        file.type === "image/heic" || /\.hei[cf]$/i.test(file.name)
          ? "HEIC photos can't be shown in most browsers. Please choose a JPG, PNG, or WebP image (or take a screenshot of the photo)."
          : "That file isn't a supported image. Please choose a JPG, PNG, or WebP photo.",
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`That photo is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please choose one under 10 MB.`);
      return;
    }
    setChecking(true);
    const ok = await canDecode(file);
    setChecking(false);
    if (!ok) {
      setError("We couldn't open that image — it may be damaged or in an unusual format. Please try another photo.");
      return;
    }
    setPhoto(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void accept(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 pt-2 md:grid-cols-12 md:gap-8 md:px-10">
      <div className="md:col-span-8">
        <h1 className="font-display text-4xl md:text-5xl">Upload your palm</h1>
        <p className="mt-2 text-mist">A photo is a visual reference to compare with the illustrated hand — it isn&apos;t analysed.</p>

        <input
          ref={inputRef}
          id="palm-upload"
          type="file"
          accept={ACCEPTED.join(",")}
          className="peer sr-only"
          aria-describedby="upload-help upload-error"
          onChange={(e) => {
            void accept(e.target.files?.[0]);
            e.target.value = ""; // allow choosing the same file again after an error
          }}
        />

        {!url ? (
          <label
            htmlFor="palm-upload"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-6 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed p-8 text-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-lavender ${
              dragging ? "border-lavender bg-lavender/10" : "border-lavender/30 bg-plum/30 hover:border-lavender/60 hover:bg-plum/50"
            }`}
          >
            <span className="grid h-16 w-16 place-items-center rounded-full border border-lavender/40 text-lavender">
              <ImagePlus size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="mt-6 font-display text-2xl">{checking ? "Opening your photo…" : "Choose a photo"}</span>
            <span id="upload-help" className="mt-2 text-sm text-mist">
              or drag and drop · JPG, PNG, WebP · Max 10 MB
            </span>
          </label>
        ) : (
          <div className="mt-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line bg-night">
              <motion.img layoutId="palm-photo" src={url} alt="Your selected palm photo" className="h-full w-full object-contain" />
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button tone="ghost" onClick={() => inputRef.current?.click()}>
                Change image
              </Button>
              <Button onClick={() => photo && onUse(photo)}>
                <Check size={16} aria-hidden="true" /> Use this photo
              </Button>
            </div>
          </div>
        )}

        <p id="upload-error" role="alert" className="mt-4 min-h-6 text-sm text-[#ffb4c8]">
          {error && (
            <span className="inline-flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </span>
          )}
        </p>
      </div>

      <aside className="md:col-span-4 md:pt-24" aria-labelledby="guide-title">
        <div className="rounded-[1.5rem] border border-line bg-plum/40 p-6 md:p-7">
          <h2 id="guide-title" className="font-display text-2xl">Image guidelines</h2>
          <ul className="mt-5 space-y-3.5">
            {GUIDELINES.map((g) => (
              <li key={g} className="flex gap-3 text-sm text-mist">
                <Check size={16} className="mt-0.5 shrink-0 text-lavender" aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
          <div className="hairline my-6" />
          <p className="flex gap-3 text-xs leading-relaxed text-haze">
            <Lock size={14} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
            Your photo is processed locally in your browser and is never uploaded or shared.
          </p>
        </div>
      </aside>
    </div>
  );
}
