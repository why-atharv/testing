"use client";

import { Download, Link2, Loader2, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, buttonClass } from "@/components/ui/Button";
import { renderShareCard } from "@/lib/share-card";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tagline: string;
}

const FILE_NAME = "mysticpalm-reading.png";

export function ShareDialog({ open, onClose, title, tagline }: ShareDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [failed, setFailed] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Render the card each time the dialog opens; the result only lives while the dialog is open.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    setFailed(false);
    setStatus("");
    renderShareCard({ title, tagline })
      .then((b) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(b);
        setBlob(b);
        setUrl(objectUrl);
        const file = new File([b], FILE_NAME, { type: "image/png" });
        setCanNativeShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setBlob(null);
      setUrl(null);
    };
  }, [open, title, tagline]);

  const shareText = `I'm ${title} — according to MysticPalm. Your hands have a story. What's yours?`;

  const share = async () => {
    if (!blob) return;
    try {
      await navigator.share({
        files: [new File([blob], FILE_NAME, { type: "image/png" })],
        title: "My MysticPalm reading",
        text: shareText,
      });
      setStatus("Shared.");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("Sharing isn't available here — download the image instead.");
    }
  };

  const copy = async () => {
    const link = `${shareText} ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(link);
      setStatus("Link copied to your clipboard.");
    } catch {
      setStatus("Couldn't copy automatically. Your browser blocked clipboard access.");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-labelledby="share-title"
      className="m-auto max-h-[94dvh] w-[min(100%-2rem,56rem)] overflow-y-auto rounded-[1.75rem] border border-line bg-night p-0 text-paper"
    >
      <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[17rem] overflow-hidden rounded-2xl border border-gold/40 bg-plum md:max-w-none">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={`Share card: ${title}. ${tagline}`} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center p-6 text-center text-sm text-mist">
              {failed ? (
                "We couldn't create the image in this browser."
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Creating your card…
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <h2 id="share-title" className="font-display text-4xl leading-tight">
              Share your <em className="text-lavender">reading</em>
            </h2>
            <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-mist hover:text-paper">
              <X size={20} />
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            A story-sized card (1080 × 1920) for WhatsApp, Instagram Stories, and more. It shows only your profile title —
            never your photo or your answers.
          </p>

          <div className="mt-8 grid gap-3">
            <a
              href={url ?? undefined}
              download={FILE_NAME}
              aria-disabled={!url}
              onClick={(e) => {
                if (!url) e.preventDefault();
                else setStatus("Image downloaded.");
              }}
              className={buttonClass("primary", `w-full ${url ? "" : "pointer-events-none opacity-40"}`)}
            >
              <Download size={16} aria-hidden="true" /> Download image
            </a>
            {canNativeShare && (
              <Button tone="ghost" className="w-full" onClick={share} disabled={!blob}>
                <Share2 size={16} aria-hidden="true" /> Share
              </Button>
            )}
            <Button tone="ghost" className="w-full" onClick={copy}>
              <Link2 size={16} aria-hidden="true" /> Copy link
            </Button>
          </div>
          <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-gold">
            {status}
          </p>
          <p className="mt-auto pt-6 text-xs leading-relaxed text-haze">
            For entertainment and self-reflection only. Palmistry is a cultural tradition, not a scientific prediction.
          </p>
        </div>
      </div>
    </dialog>
  );
}
