import { About } from "@/components/landing/About";
import { DiscoveryPreview } from "@/components/landing/DiscoveryPreview";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <DiscoveryPreview />
        <About />
        <section aria-labelledby="cta-title" className="sky border-t border-line py-24 text-center md:py-32">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">Your Hands. Your Story. Your Mystery.</p>
          <h2 id="cta-title" className="mx-auto mt-6 max-w-3xl px-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] text-balance">
            Ready to read your <em className="text-lavender">own</em> hand?
          </h2>
          <ButtonLink href="/reading" className="mt-10">
            Begin Your Reading
          </ButtonLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
