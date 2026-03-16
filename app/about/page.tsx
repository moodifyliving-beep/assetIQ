import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Globe2,
  Target,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  {
    icon: Building2,
    title: "Who we are",
    content:
      "Moodify is a real estate infrastructure platform based in Accra, Ghana. We enable property developers to raise capital from a global pool of investors through tokenization—converting physical assets into fractional, blockchain-based tokens. Our goal is to make African real estate more liquid, transparent, and accessible while opening the asset class to investors worldwide.",
  },
  {
    icon: Target,
    title: "Mission",
    content:
      "To democratize access to real estate investment by bridging African property with on-chain capital. We provide the rails that make it possible to buy, hold, and trade fractional ownership in verified properties—securely and transparently.",
  },
  {
    icon: Globe2,
    title: "What we do",
    content:
      "Moodify offers end-to-end infrastructure for tokenized real estate: property onboarding, verification, token creation, investor dashboards, automated yield distribution, and compliance. We serve developers who need capital and investors who want exposure to African real estate without traditional barriers.",
    points: [
      "Digital property onboarding and verification",
      "Fractional, tokenized ownership",
      "Automated compliance and distributions",
      "Investor dashboards and marketplace",
    ],
  },
  {
    icon: MapPin,
    title: "Why Ghana, why Africa",
    content:
      "Africa represents one of the fastest-growing real estate markets, with massive demand for housing and commercial development. Ghana offers a stable regulatory environment and a growing tech and finance sector. We start here and expand across the continent—bringing liquidity and transparency to markets that have traditionally been opaque and hard to access for global investors.",
  },
  {
    icon: Users,
    title: "Our approach",
    content:
      "We build for the long term—prioritizing compliance, transparency, and trust. Our platform is designed to meet regulatory expectations while leveraging blockchain for efficiency and global reach. We partner with developers, legal advisors, and regulators to ensure our tokenized assets are structured correctly and deliver real value to both property owners and investors.",
  },
];

const PILLS = ["Accra, Ghana", "Tokenized real estate", "Global investors", "Blockchain-powered"];

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <LandingNavbar />

      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-x-0 top-20 -z-10 h-64 bg-gradient-to-b from-primary/5 to-transparent" />
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Company</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight max-w-3xl">
              About Moodify
            </h1>
            <p className="mt-5 text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Tokenizing Africa&apos;s real estate—one fraction at a time. We&apos;re building the digital infrastructure that connects African property with global capital.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-border/80 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {pill}
                </span>
              ))}
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      <section className="pb-16">
        <Wrapper>
          <div className="grid gap-6 md:grid-cols-2 lg:max-w-5xl">
            {SECTIONS.map((section, index) => (
              <AnimationContainer key={section.title} animation="fadeUp" delay={0.1 + index * 0.05}>
                <article
                  className="group h-full rounded-2xl border border-border/60 bg-card/40 p-6 md:p-7 transition-all duration-200 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <section.icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">{section.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                  {section.points && (
                    <ul className="mt-4 space-y-2">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </AnimationContainer>
            ))}
          </div>

          <AnimationContainer animation="fadeUp" delay={0.5}>
            <div className="mt-14 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Want to learn more or partner with us?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get in touch or explore our pitch deck to see the full vision.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/contact" className="inline-flex items-center gap-2">
                      Contact us
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/pitch-deck">View pitch deck</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.55}>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      <Footer />
    </main>
  );
}
