"use client";

import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeftRight,
  Banknote,
  Calendar,
  CheckCircle2,
  Code2,
  Coins,
  Crown,
  FileText,
  Globe2,
  Handshake,
  Layers3,
  LayoutDashboard,
  Link2,
  Lock,
  Network,
  PieChart as PieChartIcon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
  Wand2,
  X,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PITCH_SECTIONS = [
  {
    id: "cover",
    label: "",
    title: "Moodify",
    subtitle: "Tokenizing Africa's Real Estate. One Fraction at a Time.",
    body: "Digital Real Estate Infrastructure Platform",
  },
  {
    id: "problem",
    label: "The problem",
    title: "African real estate: massive potential, massive barriers",
    body:
      "Traditional African real estate is largely illiquid and inaccessible—exiting an investment can take months or years, locking capital away from diaspora and global investors. High entry tickets (often $50K+ minimum) exclude the vast majority of retail investors, while developers still rely on manual, paper-heavy processes for fundraising and asset management. Fragmented infrastructure and a lack of unified digital rails make it hard to validate property data, track ownership, or distribute yield efficiently. Despite a projected $16.7T market by 2030, less than 2% of assets are digitally enabled, leaving most of the continent’s real estate offline, untradeable, and invisible to the global financial system.",
  },
  {
    id: "solution",
    label: "Our solution",
    title: "Unified digital infrastructure",
    body:
      "Moodify bridges the gap between African real estate developers and global capital through a seamless, blockchain-powered platform. We provide the infrastructure layer that connects supply-side asset originators with global, on-chain demand.",
  },
  {
    id: "market",
    label: "Market opportunity",
    title: "A massive, underserved market",
    body: "Global real estate is a multi-trillion dollar asset class. Tokenization and RWA (real-world assets) are growing fast. We focus on curated properties in high-growth markets—starting in Ghana and expanding across Africa and beyond—where demand for investable real estate outstrips supply.",
  },
  {
    id: "product",
    label: "How it works",
    title: "Seamless investment journey",
    body:
      "From brick-and-mortar to blockchain in three simple steps, connecting verified developers with global investors and automated yield.",
  },
  {
    id: "core-features",
    label: "Core features",
    title: "Comprehensive digital infrastructure",
    body:
      "Everything needed to tokenize, manage, and trade real estate assets—built into a single, programmable infrastructure layer.",
  },
  {
    id: "business-model",
    label: "Business model",
    title: "Diversified revenue streams",
    body:
      "A robust mix of transactional, recurring, and partnership revenue designed for scalability.",
  },
  {
    id: "traction",
    label: "Momentum",
    title: "Traction & milestones",
    body:
      "Rapid execution and validated demand from both developers and investors, with a clear roadmap to scale regulated tokenized assets.",
  },
  {
    id: "competitive",
    label: "Competitive landscape",
    title: "Why we win",
    body:
      "Moodify combines the stability of traditional real estate with the efficiency of blockchain—delivering capabilities that incumbents and other proptech platforms do not offer in a single stack.",
  },
  {
    id: "team",
    label: "Team",
    title: "Built for execution",
    body: "Team with experience in real estate, fintech, and Web3. Based in Accra, Ghana, with a vision to unlock property investment for local and diaspora investors, then scale.",
  },
  {
    id: "ask",
    label: "The ask",
    title: "Fuel the next phase",
    body:
      "We are raising capital to accelerate product, licenses, and market expansion—unlocking regulated, tokenized real estate access across Africa and beyond.",
  },
];

const USE_OF_FUNDS_ITEMS = [
  { label: "Product & engineering", value: 20, color: "#22c55e" },
  { label: "Hiring & team expansion", value: 25, color: "#f97316" },
  { label: "Market expansion", value: 20, color: "#0ea5e9" },
  { label: "Regulatory & compliance", value: 15, color: "#0f766e" },
  { label: "Marketing & community", value: 20, color: "#a855f7" },
];

const USE_OF_FUNDS_CHART_DATA = {
  labels: USE_OF_FUNDS_ITEMS.map((i) => i.label),
  datasets: [
    {
      data: USE_OF_FUNDS_ITEMS.map((i) => i.value),
      backgroundColor: USE_OF_FUNDS_ITEMS.map((i) => i.color),
      borderColor: "transparent",
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
};

const USE_OF_FUNDS_CHART_OPTIONS = {
  cutout: "65%",
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "hsl(var(--background))",
      titleColor: "hsl(var(--foreground))",
      bodyColor: "hsl(var(--muted-foreground))",
      borderColor: "hsl(var(--border))",
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (ctx: { label: string; parsed: number }) =>
          `${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
};

export default function PitchDeckPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      {/* Hero / CTA */}
      <section className="pt-28 pb-12 border-b border-border/40">
        <Wrapper className="flex flex-col gap-8">
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Investor materials</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Moodify investor pitch deck
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              A concise overview of our vision, product, and path to market. For the full deck or an investor call, get in touch.
            </p>
          </AnimationContainer>
          <AnimationContainer animation="fadeUp" delay={0.2}>
            <div className="flex flex-wrap gap-4">
              <Button
                type="button"
                variant="outline"
                className="no-print"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
              >
                Print / save as PDF
              </Button>
              <Button asChild variant="outline" className="no-print">
                <Link href="/contact?subject=Investor%20call">Book an investor call</Link>
              </Button>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      {/* Pitch sections (slide-style) */}
      <section className="py-12 md:py-16">
        <Wrapper className="flex flex-col gap-16 md:gap-24">
          {PITCH_SECTIONS.map((slide, index) => {
            if (slide.id === "cover") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 overflow-hidden"
                  >
                    <div className="grid lg:grid-cols-[1.2fr_1fr] min-h-[420px]">
                      {/* Left: Branding */}
                      <div className="p-8 md:p-12 flex flex-col justify-between">
                        <div>
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-amber-400 uppercase">
                            {slide.title}
                          </h2>
                          <p className="mt-4 text-base md:text-lg text-foreground">
                            {slide.subtitle}
                          </p>
                          <div className="mt-6 flex items-center gap-2">
                            <span className="h-10 w-0.5 bg-amber-400 rounded-full" />
                            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                              {slide.body}
                            </p>
                          </div>
                        </div>
                        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-400" />
                            <span>March 2026</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-amber-400" />
                            <span>Seed Round Pitch</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe2 className="h-4 w-4 text-amber-400" />
                            <span>Lagos • Accra </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Cards + grid */}
                      <div className="relative bg-muted/30 p-6 md:p-8 flex flex-col justify-end gap-4">
                        <div
                          className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                          }}
                        />
                        <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                        <div className="relative z-10 flex flex-col gap-4">
                          <div className="rounded-xl border border-border/70 bg-background/90 overflow-hidden max-w-[280px] ml-auto">
                            <div className="relative aspect-[4/3]">
                              <img
                                src="/luxury-apartment-building.png"
                                alt="Lagos Heights property exterior"
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute top-2 right-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-400/90 text-background">
                                Tokenized
                              </span>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-foreground">Lagos Heights</p>
                                <span className="text-sm font-medium text-emerald-400">+12.4% APY</span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Raised: $450,000 / $500k
                              </p>
                              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-emerald-400"
                                  style={{ width: "90%" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-background/90 p-4 max-w-[240px] flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Wallet className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Dividend Paid</p>
                              <p className="text-[10px] text-muted-foreground/80">Just now</p>
                              <p className="text-lg font-bold text-foreground">$1,240.50</p>
                              <p className="text-[10px] text-muted-foreground">USDC Received</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "problem") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
                      <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-400/70 bg-background/40 p-4 md:p-5 flex gap-3">
                          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <Lock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Illiquid &amp; Inaccessible</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              Traditional real estate is largely illiquid. Exiting an investment can take months or
                              years, locking capital away from diaspora and global investors.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-xl border border-emerald-400/70 bg-background/40 p-4 md:p-5 flex gap-3">
                          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <Banknote className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">High Capital Barriers</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              High entry tickets (often $50K+ minimum) exclude most retail investors, limiting access to
                              only the wealthy.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-xl border border-emerald-400/70 bg-background/40 p-4 md:p-5 flex gap-3">
                          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Manual &amp; Paper-Heavy</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              Developers rely on outdated, paper-based processes for capital raising and management,
                              driving high administrative overhead and poor transparency.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-xl border border-emerald-400/70 bg-background/40 p-4 md:p-5 flex gap-3">
                          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <Network className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Fragmented Infrastructure</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              There are no unified digital rails to validate property data, track ownership, or
                              distribute yield efficiently across markets.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-emerald-400/70 bg-background/60 p-5 md:p-6 flex flex-col justify-between">
                        <div>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                            The digital gap
                          </span>
                          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                            Projected market size (2030)
                          </p>
                          <p className="mt-3 text-3xl md:text-4xl font-semibold text-foreground">$16.7T</p>
                          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                            Total value of African real estate.
                          </p>
                        </div>

                        <div className="mt-6">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                            <span>&lt; 2% digitization</span>
                            <span>&lt; 2%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-border/70 overflow-hidden">
                            <div className="h-full w-[10%] rounded-full bg-emerald-400" />
                          </div>
                          <p className="mt-3 text-xs md:text-sm text-muted-foreground">
                            Despite rapid urbanization, the vast majority of assets remain offline, untradeable, and
                            invisible to the global financial system.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "solution") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.6fr)_minmax(0,1.3fr)] items-stretch">
                      {/* Developers (left) */}
                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                              <Layers3 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Developers</p>
                              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                                Supply side
                              </p>
                            </div>
                          </div>
                          <ul className="mt-5 space-y-2 text-xs md:text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Upload property assets</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Legal structuring</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Management dashboard</span>
                            </li>
                          </ul>
                        </div>
                        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400">
                          Asset origination
                        </p>
                      </div>

                      {/* Moodify Core (center) */}
                      <div className="rounded-2xl bg-gradient-to-b from-amber-500/15 via-background/90 to-background border border-amber-400/60 p-5 md:p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-foreground">Moodify Core</p>
                          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Infrastructure layer
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 rounded-xl bg-background/60 border border-border/60 p-3">
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                              <Wallet className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">Tokenization engine</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Converts deeds and cash flows into compliant digital shares.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-xl bg-background/60 border border-border/60 p-3">
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">AI automation</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                KYC/AML, risk scoring, and compliance workflows built into the rails.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-xl bg-background/60 border border-border/60 p-3">
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">Smart distribution</p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Automated rental and yield payouts to investors’ wallets.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investors (right) */}
                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                              <Globe2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Investors</p>
                              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                                Global demand
                              </p>
                            </div>
                          </div>
                          <ul className="mt-5 space-y-2 text-xs md:text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Fractional ownership</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Invest from $100</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span>Secondary trading (future)</span>
                            </li>
                          </ul>
                        </div>
                        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                          Capital injection
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3 text-xs md:text-sm text-muted-foreground">
                      <div className="border-t border-amber-400/70 pt-3">
                        <p className="font-medium text-foreground">Faster capital</p>
                        <p className="mt-1">
                          Developers access global liquidity pools instantly, reducing fundraising time.
                        </p>
                      </div>
                      <div className="border-t border-emerald-400/70 pt-3">
                        <p className="font-medium text-foreground">Trusted &amp; compliant</p>
                        <p className="mt-1">
                          End-to-end regulatory compliance embedded directly into the infrastructure.
                        </p>
                      </div>
                      <div className="border-t border-emerald-400/70 pt-3">
                        <p className="font-medium text-foreground">Liquid assets</p>
                        <p className="mt-1">
                          Real estate becomes as tradable as stocks, unlocking value for all stakeholders.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "product") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      {/* Step 1 */}
                      <div className="relative rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6 flex flex-col">
                        <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full border border-amber-400 bg-background text-xs font-semibold text-amber-300">
                          01
                        </div>
                        <div className="mt-2 flex flex-col items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                            <Layers3 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Developers list</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              Verified developers upload property details. Moodify handles legal structuring and
                              tokenizes the asset into fractional digital shares.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                            Asset verification
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                            Smart contracts
                          </span>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative rounded-2xl bg-background/60 border border-emerald-400/70 p-5 md:p-6 flex flex-col">
                        <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400 bg-background text-xs font-semibold text-emerald-300">
                          02
                        </div>
                        <div className="mt-2 flex flex-col items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                            <Globe2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Discover &amp; invest</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              Global investors browse high-yield opportunities and invest from as little as $100 using
                              stablecoins or local fiat, with instant settlement to their wallet.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                            Low minimums
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                            Multi-currency
                          </span>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6 flex flex-col">
                        <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full border border-amber-400 bg-background text-xs font-semibold text-amber-300">
                          03
                        </div>
                        <div className="mt-2 flex flex-col items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Earn &amp; trade</p>
                            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                              Receive automated rental income directly to your wallet. Hold for long-term appreciation or
                              trade tokenized shares on secondary markets as liquidity becomes available.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                            Automated yield
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1">
                            Liquid trading
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "core-features") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {/* Row 1 */}
                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Tokenization engine</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Converts property deeds into regulator-compliant fractional digital shares on-chain.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <LayoutDashboard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Developer dashboard</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Centralized portal to list assets, track funding progress, and manage investors.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <Wand2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">AI automation</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Automated KYC/AML checks, risk scoring, and investor matching flows.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <Banknote className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Income distribution</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Smart contracts calculate and distribute rental yield to thousands of wallet addresses.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <Globe2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Cross-border pay</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Seamless payment rails accepting USDC/ETH, mobile money, and bank transfers.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <ArrowLeftRight className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Secondary market</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              P2P trading venue providing instant liquidity for fractional share owners.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6 md:col-span-2 lg:col-span-1">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Listing sync</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Real-time synchronization of property data across multiple marketplaces and platforms.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "business-model") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                      {/* Row 1 */}
                      <div className="relative rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <span className="absolute top-4 right-4 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Primary
                        </span>
                        <div className="flex flex-col gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-400/15 text-amber-400">
                            <Banknote className="h-4 w-4" />
                          </div>
                          <p className="text-2xl font-bold text-amber-400">1 – 2%</p>
                          <p className="text-sm font-semibold text-foreground">Transaction fee</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Charged on every initial property investment made through the platform. Scales directly with
                            Gross Merchandise Value (GMV).
                          </p>
                        </div>
                      </div>

                      <div className="relative rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <span className="absolute top-4 right-4 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Recurring
                        </span>
                        <div className="flex flex-col gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <Code2 className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            <span className="text-emerald-400">SaaS</span> developer fee
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Monthly or annual subscription for developers to access the dashboard, list properties, and
                            manage investor relations.
                          </p>
                        </div>
                      </div>

                      <div className="relative rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <span className="absolute top-4 right-4 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Volume
                        </span>
                        <div className="flex flex-col gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-400/15 text-amber-400">
                            <ArrowLeftRight className="h-4 w-4" />
                          </div>
                          <p className="text-2xl font-bold text-amber-400">0.5 – 1%</p>
                          <p className="text-sm font-semibold text-foreground">Secondary market</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Fee applied to every peer-to-peer trade of fractional shares on the secondary marketplace,
                            ensuring long-tail revenue.
                          </p>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6">
                        <div className="flex flex-col gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <Crown className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-semibold text-foreground">Premium investor features</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Tiered subscription for advanced analytics, early access to hot deals, and portfolio
                            management tools.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-background/50 border border-border/70 p-5 md:p-6 md:col-span-2">
                        <div className="flex flex-col gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                            <Handshake className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-semibold text-foreground">Partnership revenue</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Integration and referral fees from banking partners, payment gateways, and legal service
                            providers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "traction") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)] items-start">
                      {/* Metrics */}
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl bg-background/60 border border-emerald-400/60 p-4 md:p-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-emerald-400 uppercase tracking-[0.18em]">
                                  Platform
                                </p>
                                <p className="text-sm font-semibold text-foreground">MVP built &amp; live</p>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-2xl bg-background/60 border border-border/70 p-4 md:p-5">
                            <p className="text-2xl font-semibold text-foreground">1,200+</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">Investor waitlist</p>
                          </div>
                          <div className="rounded-2xl bg-background/60 border border-border/70 p-4 md:p-5">
                            <p className="text-2xl font-semibold text-foreground">3</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">Pilot developers onboarded</p>
                          </div>
                          <div className="rounded-2xl bg-background/60 border border-emerald-400/60 p-4 md:p-5">
                            <p className="text-2xl font-semibold text-foreground">$4.2M</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">Properties pipeline</p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-background/90 to-background border border-amber-400/70 p-5 md:p-6">
                          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
                            <Target className="h-3 w-3" />
                            <span>Year 1 target</span>
                          </div>
                          <p className="mt-3 text-3xl md:text-4xl font-semibold text-foreground">$25M</p>
                          <p className="mt-1 text-xs md:text-sm text-muted-foreground">Total tokenized assets</p>
                        </div>
                      </div>

                      {/* Roadmap */}
                      <div className="rounded-2xl bg-background/60 border border-border/70 p-5 md:p-6 space-y-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          Execution roadmap
                        </p>

                        <div className="space-y-4">
                          {/* Q1 */}
                          <div className="relative rounded-2xl bg-background/80 border border-emerald-400/60 p-4 md:p-5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Q1 2024
                              </p>
                              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                                Done
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-foreground">MVP launch &amp; pilots</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Beta platform live. First pilot developer partnerships signed. Waitlist opened.
                            </p>
                          </div>

                          {/* Q2 */}
                          <div className="relative rounded-2xl bg-background/80 border border-amber-400/60 p-4 md:p-5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Q2 2024
                              </p>
                              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
                                In progress
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-foreground">Licensing &amp; compliance</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Securing sandbox licenses in key West African markets. Smart contract audits.
                            </p>
                          </div>

                          {/* Q3 */}
                          <div className="relative rounded-2xl bg-background/80 border border-border/70 p-4 md:p-5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Q3 2024
                              </p>
                              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                Planned
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-foreground">Public launch &amp; scale</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Open platform beyond pilots. First $5M in assets tokenized and onboarding of new
                              distribution partners.
                            </p>
                          </div>

                          {/* Q4 */}
                          <div className="relative rounded-2xl bg-background/80 border border-border/70 p-4 md:p-5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Q4 2024
                              </p>
                              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                Planned
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-foreground">Secondary market</p>
                            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                              Launch P2P trading for liquidity and expand coverage to additional African markets.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "competitive") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 overflow-x-auto">
                      <div className="min-w-[720px] rounded-2xl bg-background/60 border border-border/70 p-5 md:p-6">
                        <div className="grid grid-cols-[minmax(0,2.2fr)_repeat(4,minmax(0,1fr))] gap-4 text-xs md:text-sm">
                          {/* Header row */}
                          <div className="text-muted-foreground text-[11px] uppercase tracking-[0.2em]">
                            Key capabilities
                          </div>
                          <div className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            Traditional real estate
                          </div>
                          <div className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            REITs (public/private)
                          </div>
                          <div className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            Other proptech
                          </div>
                          <div className="text-center text-[11px] uppercase tracking-[0.18em] text-amber-300">
                            Moodify
                          </div>

                          {/* Row: Fractional ownership */}
                          <div className="flex items-center gap-2 py-3 border-t border-border/60">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                              <PieChartIcon className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-medium text-foreground">Fractional ownership</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>

                          {/* Row: Blockchain-backed */}
                          <div className="flex items-center gap-2 py-3 border-t border-border/60">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                              <Link2 className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-medium text-foreground">Blockchain-backed</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <span>—</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>

                          {/* Row: AI automation */}
                          <div className="flex items-center gap-2 py-3 border-t border-border/60">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                              <Sparkles className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-medium text-foreground">AI automation</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>

                          {/* Row: Africa-focused */}
                          <div className="flex items-center gap-2 py-3 border-t border-border/60">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                              <Globe2 className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-medium text-foreground">Africa-focused</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <span>—</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>

                          {/* Row: Cross-border pay */}
                          <div className="flex items-center gap-2 py-3 border-t border-border/60">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                              <ArrowLeftRight className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-medium text-foreground">Cross-border pay</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>

                          {/* Row: Developer tools */}
                          <div className="flex items-center gap-2 py-3 border-t border-border/60">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                              <Code2 className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-medium text-foreground">Developer tools</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <span>—</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-muted-foreground">
                            <span>—</span>
                          </div>
                          <div className="flex items-center justify-center border-t border-border/60 text-xs text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            if (slide.id === "ask") {
              return (
                <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                  <div
                    id={slide.id}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-10"
                  >
                    {slide.label && (
                      <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                    )}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                      The ask
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {slide.body}
                    </p>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)] items-start">
                      {/* Left: round + objectives */}
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-background/90 to-background border border-amber-400/70 p-5 md:p-6">
                          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            Raising
                          </p>
                          <p className="mt-2 text-3xl md:text-4xl font-semibold text-foreground">$2.5M</p>
                          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                            Seed round
                          </p>
                        </div>

                        <div className="rounded-2xl bg-background/60 border border-border/70 p-5 md:p-6 space-y-4">
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                            18-month objectives
                          </p>
                          <div className="space-y-3 text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                                <Target className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">$25M TVL</p>
                                <p className="mt-0.5">Tokenized assets under management on Moodify.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">10,000 investors</p>
                                <p className="mt-0.5">Active users on the platform across priority markets.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
                                <ArrowLeftRight className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">Secondary market live</p>
                                <p className="mt-0.5">Full liquidity launch in priority regions with compliant rails.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: use of funds (pie + legend) */}
                      <div className="rounded-2xl bg-background/60 border border-border/70 p-5 md:p-6 space-y-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          Use of funds
                        </p>
                        <div className="mt-2 flex flex-col md:flex-row items-center gap-6">
                          {/* Donut chart (Chart.js) */}
                          <div className="relative flex items-center justify-center h-40 w-40 md:h-44 md:w-44">
                            <Doughnut
                              data={USE_OF_FUNDS_CHART_DATA}
                              options={USE_OF_FUNDS_CHART_OPTIONS}
                              className="w-full h-full"
                            />
                            <div className="pointer-events-none absolute flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-full bg-background/95">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                Allocated
                              </span>
                              <span className="text-lg font-semibold text-foreground">100%</span>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex-1 space-y-3 text-xs md:text-sm text-muted-foreground">
                            {USE_OF_FUNDS_ITEMS.map((item) => (
                              <div
                                key={item.label}
                                className="flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <p className="text-sm font-semibold text-foreground">
                                    {item.label}
                                  </p>
                                </div>
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: item.color }}
                                >
                                  {item.value}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimationContainer>
              );
            }

            return (
              <AnimationContainer key={slide.id} animation="fadeUp" delay={0.05 * index}>
                <div
                  id={slide.id}
                  className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/30 p-6 md:p-10"
                >
                  {slide.label && (
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{slide.label}</p>
                  )}
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                    {slide.title}
                  </h2>
                  <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                    {slide.body}
                  </p>
                </div>
              </AnimationContainer>
            );
          })}
        </Wrapper>
      </section>

      {/* Our Vision */}
      <section className="py-16 border-t border-border/40">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 md:p-16 text-center">
              <span className="pointer-events-none select-none absolute left-4 top-1/2 -translate-y-1/2 text-[8rem] font-serif text-foreground/5 leading-none md:left-8">
                &ldquo;
              </span>
              <span className="pointer-events-none select-none absolute right-4 top-1/2 -translate-y-1/2 text-[8rem] font-serif text-foreground/5 leading-none md:right-8">
                &rdquo;
              </span>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Our vision</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground max-w-3xl mx-auto">
                We are building the{" "}
                <span className="text-amber-400">financial rails</span> that will make African real estate
                investable for the <span className="text-amber-400">world.</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground">
                Partner with us. <span className="text-amber-400">Invest with us.</span> Build with us.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-amber-500 hover:bg-amber-600 text-background">
                  <Link href="/contact?subject=Investor%20interest">
                    Invest now <span className="ml-1">→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact?subject=Investor%20demo">Schedule demo</Link>
                </Button>
              </div>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-16 border-t border-border/40">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Get in touch</h2>
              <p className="mt-2 text-muted-foreground">
                East Legon, Accra, Ghana · info@moodify.site · +233 532-818-725
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="mailto:info@moodify.site">Email us</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>
    </main>
  );
}
