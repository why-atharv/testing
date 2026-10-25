import Link from "next/link";

/** Original brand mark: a minimal open palm drawn as a single fine line, with a heart-line spark. */
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M10.5 29c-.6-2.6-2.2-4.4-3.9-6.3-1.4-1.6-2.6-3-2.1-4.4.5-1.3 2.1-1.2 3.3-.1l1.7 1.6V7.4c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v7.3V4.6c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v10.1V6c0-1 .7-1.7 1.6-1.7s1.6.7 1.6 1.7v9.2-6.6c0-1 .7-1.7 1.6-1.7s1.5.7 1.5 1.7V19c0 4.3-1.6 7.3-3.4 10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.4 19.6c1.6-1.3 3.7-1.6 6.6-.9" stroke="#e3c88f" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="25.5" cy="4.5" r="1" fill="#e3c88f" />
    </svg>
  );
}

export function Logo({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2.5 text-paper ${className}`} aria-label="MysticPalm home">
      <BrandMark className="h-7 w-7 text-lavender transition-colors group-hover:text-white" />
      <span className="font-display text-[1.45rem] font-medium leading-none tracking-[0.01em]">
        Mystic<span className="italic text-lavender">Palm</span>
      </span>
    </Link>
  );
}
