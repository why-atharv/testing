import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Tone = "primary" | "ghost" | "quiet";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold tracking-[0.01em] transition-all duration-300 ease-out-soft disabled:pointer-events-none disabled:opacity-40";

const tones: Record<Tone, string> = {
  primary:
    "bg-gradient-to-b from-[#c4b2ff] to-[#9d7bff] text-ink shadow-[0_10px_40px_-12px_rgba(157,123,255,0.8),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_14px_50px_-10px_rgba(157,123,255,0.95),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "border border-lavender/35 text-paper hover:border-lavender/70 hover:bg-lavender/[0.06]",
  quiet: "text-mist hover:text-paper px-3",
};

export function buttonClass(tone: Tone = "primary", extra = "") {
  return `${base} ${tones[tone]} ${extra}`;
}

export function Button({ tone = "primary", className = "", ...props }: ComponentProps<"button"> & { tone?: Tone }) {
  return <button type="button" className={buttonClass(tone, className)} {...props} />;
}

export function ButtonLink({
  tone = "primary",
  className = "",
  href,
  children,
  ...rest
}: { tone?: Tone; className?: string; href: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={buttonClass(tone, className)} {...rest}>
      {children}
    </Link>
  );
}
