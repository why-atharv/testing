import { Reveal } from "@/components/ui/Reveal";
import { HAND_OUTLINE, PALM_LINES, LINE_COLORS } from "@/lib/hand-geometry";

function StepArtFrame() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" fill="none">
      <g transform="translate(52 22) scale(0.24)">
        <path d={HAND_OUTLINE} stroke="#d4c6ff" strokeOpacity="0.7" strokeWidth="5" />
      </g>
      {/* capture guide corners */}
      {[
        "M34 40 V28 H46",
        "M154 28 H166 V40",
        "M166 160 V172 H154",
        "M46 172 H34 V160",
      ].map((d) => (
        <path key={d} d={d} stroke="#e3c88f" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      <circle cx="100" cy="186" r="2" fill="#e3c88f" />
    </svg>
  );
}

function StepArtLines() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" fill="none">
      <g transform="translate(-10 -40) scale(0.55)">
        {PALM_LINES.map((l) => (
          <path key={l.id} d={l.d} stroke={LINE_COLORS[l.id]} strokeWidth="4" strokeLinecap="round" />
        ))}
      </g>
      {PALM_LINES.map((l, i) => (
        <circle key={l.id} cx={40 + i * 40} cy="184" r="3" fill={LINE_COLORS[l.id]} />
      ))}
    </svg>
  );
}

function StepArtStory() {
  const stars = [
    [40, 140], [64, 92], [100, 70], [138, 96], [160, 52], [120, 140],
  ];
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" fill="none">
      <path d="M40 140 L64 92 L100 70 L138 96 L160 52 M100 70 L120 140" stroke="#d4c6ff" strokeOpacity="0.5" strokeWidth="1" />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 4 ? 4 : 2.6} fill={i === 4 ? "#e3c88f" : "#d4c6ff"} />
      ))}
      <path d="M30 172 H170" stroke="#e3c88f" strokeOpacity="0.5" />
      <path d="M58 182 H142" stroke="#e3c88f" strokeOpacity="0.25" />
    </svg>
  );
}

const STEPS = [
  {
    title: "Discover Your Palm",
    body: "Take a photo with your camera, choose one from your device, or begin straight away with our illustrated hand. Your photo stays on your device.",
    Art: StepArtFrame,
  },
  {
    title: "Explore the Lines",
    body: "Trace the heart, head, life, and fate lines. Learn what each has traditionally been said to mean, and answer one short reflection for each.",
    Art: StepArtLines,
  },
  {
    title: "Uncover Your Story",
    body: "Your choices shape a playful profile, four line readings, and a next adventure to try — plus a card to share with friends.",
    Art: StepArtStory,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative scroll-mt-20 bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="grid gap-6 md:grid-cols-12">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold md:col-span-3 md:pt-4">How it works</p>
          <h2 id="how-title" className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1] tracking-[-0.01em] md:col-span-8 text-balance">
            Three movements, <em className="text-lavender">one small ritual</em> of curiosity.
          </h2>
        </Reveal>

        <ol className="mt-16 md:mt-24">
          {STEPS.map(({ title, body, Art }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 0.08}
              className="grid items-center gap-6 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14"
            >
              <span className="font-display text-6xl font-light italic leading-none text-gold/80 md:col-span-2 md:text-8xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={`md:col-span-5 ${i % 2 ? "md:col-start-6" : "md:col-start-4"}`}>
                <h3 className="font-display text-3xl font-medium md:text-4xl">{title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-mist text-pretty">{body}</p>
              </div>
              <div className={`h-36 w-36 md:h-44 md:w-44 ${i % 2 ? "md:col-start-11" : "md:col-start-10"} md:col-span-2 md:justify-self-end`}>
                <Art />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
