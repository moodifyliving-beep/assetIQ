"use client";

import LandingNavbar from "@/components/landing/navbar";
import VideoHero from "@/components/landing/video-hero";
import Perks from "@/components/landing/perks";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Features from "@/components/landing/features";
import Testimonials from "@/components/landing/testimonials";
import Pricing from "@/components/landing/pricing";
import PlatformMetrics from "@/components/landing/platform-metrics";
import SecurityTrust from "@/components/landing/security-trust";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="w-full relative min-h-screen bg-background overflow-x-hidden">
      <LandingNavbar />
      <div className="w-full relative flex flex-col">
        <section className="w-full relative z-0">
          <VideoHero />
        </section>
        <section className="w-full relative z-10">
          <Perks />
        </section>
        <section className="w-full relative z-10">
          <Hero />
        </section>
        <section className="w-full relative z-10">
          <HowItWorks />
        </section>
        <section className="w-full relative z-10">
          <Features />
        </section>
        <section className="w-full relative z-10">
          <Testimonials />
        </section>
        <section className="w-full relative z-10">
          <Pricing />
        </section>
        <section className="w-full relative z-10">
          <PlatformMetrics />
        </section>
        <section className="w-full relative z-10">
          <SecurityTrust />
        </section>
        <section className="w-full relative z-10">
          <FAQ />
        </section>
        <section className="w-full relative z-10">
          <CTA />
        </section>
      </div>
      <Footer />
    </main>
  );
}
