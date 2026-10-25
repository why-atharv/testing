"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

const LINKS = [
  { href: "#discover", label: "Discover" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <Logo />
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-mist transition-colors hover:text-paper">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <ButtonLink href="/reading" tone="ghost" className="min-h-10 px-5 text-sm">
            Begin Your Reading
          </ButtonLink>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-paper md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] border-t border-line bg-ink px-5 pb-10 pt-8 md:hidden"
      >
        <ul className="space-y-1">
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-line py-5 font-display text-4xl text-paper"
              >
                <span className="font-sans text-xs tracking-widest text-gold">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ButtonLink href="/reading" className="mt-10 w-full" onClick={() => setOpen(false)}>
          Begin Your Reading
        </ButtonLink>
      </div>
    </header>
  );
}
