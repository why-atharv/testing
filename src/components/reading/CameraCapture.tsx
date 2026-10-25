"use client";

import { AlertCircle, Check, RefreshCw, RotateCcw, SwitchCamera } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { HAND_OUTLINE } from "@/lib/hand-geometry";
import { usePhotoUrl } from "./usePhotoUrl";

type Status = "requesting" | "live" | "captured" | "error";
type ErrorKind = "denied" | "unsupported" | "notfound" | "busy" | "generic";

const ERROR_COPY: Record<ErrorKind, { title: string; body: string }> = {
  denied: {
    title: "Camera permission was declined",
    body: "That's completely fine. To try again, allow camera access from your browser's address bar or site settings, then choose “Try again”. You can also upload a photo or explore manually.",
  },
  unsupported: {
    title: "This browser can't open the camera here",
    body: "Camera access needs a modern browser and a secure (https) connection. You can still upload a photo or explore manually.",
  },
  notfound: {
    title: "No camera was found",
    body: "We couldn't find a camera on this device. Try uploading a photo instead, or explore manually.",
  },
  busy: {
    title: "The camera is busy",
    body: "Another app or tab may be using the camera. Close it and choose “Try again”.",
  },
  generic: {
    title: "The camera couldn't start",
    body: "Something went wrong while opening the camera. Choose “Try again”, or continue another way.",
  },
};

const TIPS = [
  "Use good, even lighting.",
  "Keep the entire palm visible.",
  "Spread your fingers naturally.",
  "Position your palm inside the guide.",
  "Keep the camera steady.",
];

function classifyError(err: unknown): ErrorKind {
  const name = err instanceof DOMException || err instanceof Error ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "notfound";
  if (name === "NotReadableError" || name === "AbortError") return "busy";
  return "generic";
}

interface CameraCaptureProps {
  onUse: (photo: Blob) => void;
  onUpload: () => void;
  onManual: () => void;
}

export function CameraCapture({ onUse, onUpload, onManual }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestId = useRef(0);
  const [status, setStatus] = useState<Status>("requesting");
  const [error, setError] = useState<ErrorKind | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [mirrored, setMirrored] = useState(false);
  const [canSwitch, setCanSwitch] = useState(false);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const photoUrl = usePhotoUrl(photo);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(
    async (mode: "environment" | "user") => {
      stop();
      const id = ++requestId.current;
      setStatus("requesting");
      setError(null);

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setError("unsupported");
        setStatus("error");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        // The user may have left or restarted while the permission prompt was open.
        if (id !== requestId.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const settings = stream.getVideoTracks()[0]?.getSettings();
        // Laptop webcams usually report no facingMode; mirror those like a selfie camera.
        setMirrored(settings?.facingMode !== "environment");
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => {
            /* autoplay may be deferred; the muted inline video starts once visible */
          });
        }
        setStatus("live");

        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        if (id === requestId.current) setCanSwitch(devices.filter((d) => d.kind === "videoinput").length > 1);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(classifyError(err));
        setStatus("error");
      }
    },
    [stop],
  );

  useEffect(() => {
    void start("environment");
    return () => {
      // Invalidate any in-flight request; the counter is meant to be read at cleanup time.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      requestId.current++;
      stop();
    };
  }, [start, stop]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("generic");
          setStatus("error");
          return;
        }
        setPhoto(blob);
        setStatus("captured");
        stop(); // release the camera as soon as we have the frame
      },
      "image/jpeg",
      0.9,
    );
  };

  const retake = () => {
    setPhoto(null);
    void start(facing);
  };

  const switchCamera = () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    void start(next);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 pt-2 md:grid-cols-12 md:gap-8 md:px-10">
      <div className="md:col-span-8">
        <h1 className="sr-only">Live palm scan</h1>
        <div className="relative mx-auto aspect-[3/4] max-h-[72svh] w-full overflow-hidden rounded-[1.75rem] border border-line bg-night md:aspect-[4/3]">
          {/* Live video stays mounted so the stream can attach before it is shown */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            aria-label="Camera preview"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              status === "live" ? "opacity-100" : "opacity-0"
            } ${mirrored ? "-scale-x-100" : ""}`}
          />

          {status === "captured" && photoUrl && (
            <motion.img
              layoutId="palm-photo"
              src={photoUrl}
              alt="Your captured palm photo"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {status === "live" && <PalmGuide />}

          {status === "requesting" && (
            <div className="absolute inset-0 grid place-items-center p-8 text-center">
              <div>
                <p className="font-display text-2xl">Waiting for camera permission…</p>
                <p className="mt-2 text-sm text-mist">Your browser will ask before the camera turns on.</p>
              </div>
            </div>
          )}

          {status === "error" && error && (
            <div role="alert" className="absolute inset-0 grid place-items-center overflow-y-auto p-6 text-center md:p-12">
              <div className="max-w-md">
                <AlertCircle className="mx-auto text-gold" size={28} aria-hidden="true" />
                <p className="mt-4 font-display text-3xl">{ERROR_COPY[error].title}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{ERROR_COPY[error].body}</p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
                  {error !== "unsupported" && error !== "notfound" && (
                    <Button onClick={() => void start(facing)}>
                      <RefreshCw size={16} aria-hidden="true" /> Try again
                    </Button>
                  )}
                  <Button tone="ghost" onClick={onUpload}>Upload a photo</Button>
                  <Button tone="ghost" onClick={onManual}>Explore manually</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-5 flex min-h-20 items-center justify-center gap-6">
          {status === "live" && (
            <>
              <span className="w-12" aria-hidden="true" />
              <button
                type="button"
                onClick={capture}
                aria-label="Capture photo"
                className="group grid h-20 w-20 place-items-center rounded-full border-2 border-lavender/70 transition-transform active:scale-95"
              >
                <span className="h-15 w-15 rounded-full bg-gradient-to-b from-[#d4c6ff] to-[#9d7bff] shadow-[0_0_30px_rgba(157,123,255,0.6)] transition-transform group-hover:scale-105" />
              </button>
              {canSwitch ? (
                <button
                  type="button"
                  onClick={switchCamera}
                  aria-label="Switch camera"
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-mist hover:text-paper"
                >
                  <SwitchCamera size={20} aria-hidden="true" />
                </button>
              ) : (
                <span className="w-12" aria-hidden="true" />
              )}
            </>
          )}
          {status === "captured" && (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button tone="ghost" onClick={retake}>
                <RotateCcw size={16} aria-hidden="true" /> Retake
              </Button>
              <Button onClick={() => photo && onUse(photo)}>
                <Check size={16} aria-hidden="true" /> Use this photo
              </Button>
            </div>
          )}
        </div>
        {status === "live" && <p className="text-center text-xs text-haze">Keep your hand inside the outline, then capture.</p>}
      </div>

      <aside className="md:col-span-4" aria-labelledby="tips-title">
        <div className="rounded-[1.5rem] border border-line bg-plum/40 p-6 md:p-7">
          <h2 id="tips-title" className="font-display text-2xl">Tips for a clear capture</h2>
          <ul className="mt-5 space-y-3.5">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm text-mist">
                <Check size={16} className="mt-0.5 shrink-0 text-lavender" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
          <div className="hairline my-6" />
          <p className="text-xs leading-relaxed text-haze">
            Your photo stays on this device. It isn&apos;t uploaded or analysed automatically — you&apos;ll use it as a
            visual reference beside the illustrated hand. The camera switches off as soon as you capture or leave.
          </p>
        </div>
      </aside>
    </div>
  );
}

function PalmGuide() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 400 560" className="absolute left-1/2 top-1/2 h-[82%] -translate-x-1/2 -translate-y-1/2" fill="none">
        <path d={HAND_OUTLINE} stroke="#f4efff" strokeOpacity="0.75" strokeWidth="2.5" strokeDasharray="8 8" />
      </svg>
      {["left-5 top-5 border-l-2 border-t-2", "right-5 top-5 border-r-2 border-t-2", "bottom-5 left-5 border-b-2 border-l-2", "bottom-5 right-5 border-b-2 border-r-2"].map(
        (c) => (
          <span key={c} className={`absolute h-10 w-10 rounded-sm border-lavender ${c}`} />
        ),
      )}
    </div>
  );
}
