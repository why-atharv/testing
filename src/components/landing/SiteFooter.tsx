import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MotionToggle } from "@/components/ui/MotionPreference";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:px-10 md:py-20">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
            An interactive palmistry experience for curiosity, reflection, and fun. Created for Ideas 4.0, the student
            innovation exhibition — October 27–28, 2026.
          </p>
          <MotionToggle className="mt-8" />
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link href="/#discover" className="text-mist hover:text-paper">Discover</Link></li>
            <li><Link href="/#how-it-works" className="text-mist hover:text-paper">How It Works</Link></li>
            <li><Link href="/#about" className="text-mist hover:text-paper">About</Link></li>
            <li><Link href="/reading" className="text-mist hover:text-paper">Begin Your Reading</Link></li>
          </ul>
        </nav>

        <div className="space-y-8 md:col-span-5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Privacy</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Palm photos stay on your device. They are held in your browser&apos;s memory only while you use the
              experience, never uploaded, and discarded when you start over or close the tab. Your answers are not stored.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">A note on palmistry</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Palmistry is a cultural tradition, not a scientifically validated method of prediction. Every reading here
              is for entertainment and self-reflection.
            </p>
          </div>
        </div>
      </div>
      <div className="hairline mx-auto max-w-7xl" />
      <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-haze md:px-10">
        © {new Date().getFullYear()} MysticPalm. A student project for Ideas 4.0.
      </p>
    </footer>
  );
}
