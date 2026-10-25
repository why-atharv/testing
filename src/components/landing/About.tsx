import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">About</p>
          </Reveal>
          <Reveal className="md:col-span-9">
            <h2 id="about-title" className="font-display text-[clamp(2.2rem,4.6vw,4rem)] font-normal leading-[1.05] text-balance">
              An old tradition, <em className="text-lavender">retold</em> with new tools — for wonder, not for prophecy.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4 md:col-start-4">
            <p className="leading-relaxed text-mist">
              Palmistry has been practised across many cultures for centuries — a way of turning the lines of a hand into
              stories. MysticPalm brings those traditional interpretations together with interactive illustration and short
              reflection prompts, so the reading becomes something you take part in.
            </p>
          </Reveal>
          <Reveal className="md:col-span-4" delay={0.1}>
            <p className="leading-relaxed text-mist">
              Your profile is shaped by the answers you choose — not by your photograph, and not by any hidden analysis. We
              show exactly how each choice contributed. Think of it as a conversation starter about yourself.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {[
            ["For entertainment", "Readings are for fun and self-reflection. Palmistry is not a scientifically validated way to predict anything."],
            ["No predictions", "We never comment on health, lifespan, money, grades, relationships, or careers."],
            ["Private by design", "Photos stay in your browser's memory and are discarded when you leave. Nothing is uploaded."],
          ].map(([title, body]) => (
            <div key={title} className="bg-ink p-8">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
