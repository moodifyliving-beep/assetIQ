import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, Sparkles, Layers3, Banknote, Shield } from "lucide-react";

const TECH_STACK_LAYERS = [
  {
    id: "developer-api",
    title: "Developer API Layer",
    description: "RESTful API & Webhooks for seamless property listing synchronization and partner integrations.",
    tags: ["REST API", "GraphQL", "Node.js"],
    icon: Code2,
    borderClass: "border-l-violet-500",
    iconClass: "bg-violet-500/10 text-violet-400",
  },
  {
    id: "ai-automation",
    title: "AI Automation Layer",
    description: "Machine learning models for automated KYC/AML checks, risk scoring, and investor matching.",
    tags: ["Python", "TensorFlow", "OCR"],
    icon: Sparkles,
    borderClass: "border-l-emerald-500",
    iconClass: "bg-emerald-500/10 text-emerald-400",
  },
  {
    id: "blockchain-core",
    title: "Blockchain Core",
    description: "Smart contracts governing asset tokenization, fractional ownership, and automated rental payouts.",
    tags: ["Solidity", "ERC-3643", "Polygon"],
    icon: Layers3,
    borderClass: "border-l-amber-500",
    iconClass: "bg-amber-500/10 text-amber-400",
  },
  {
    id: "payment",
    title: "Payment Infrastructure",
    description: "Multi-rail settlement gateway supporting crypto wallets, SWIFT/ACH, and mobile money.",
    tags: ["USDC", "Stripe Connect", "Flutterwave"],
    icon: Banknote,
    borderClass: "border-l-sky-400",
    iconClass: "bg-sky-400/10 text-sky-400",
  },
  {
    id: "security",
    title: "Security & Compliance",
    description: "End-to-end encryption, role-based access control (RBAC), and regulatory-compliant data storage.",
    tags: ["AES-256", "SOC2", "ISO 27001"],
    icon: Shield,
    borderClass: "border-l-blue-600",
    iconClass: "bg-blue-600/10 text-blue-400",
  },
];

export default function WhitepaperPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <section className="pt-28 pb-16">
        <Wrapper className="flex flex-col gap-10">
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Technical overview</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Moodify protocol whitepaper
              </h1>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Our whitepaper describes how Moodify tokenizes real‑world properties, manages compliance workflows and
                routes cashflows between investors, asset originators and service providers.
              </p>
            </div>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.2}>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/docs/moodify-whitepaper.pdf">
                  Download whitepaper (PDF)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Talk to the team
                </Link>
              </Button>
            </div>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.3}>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <h2 className="text-sm font-semibold mb-2">Architecture</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  High‑level system design, including smart‑contracts, off‑chain services and data sources.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <h2 className="text-sm font-semibold mb-2">Risk & compliance</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  How issuances, investor onboarding and secondary transfers are constrained by jurisdictional rules.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <h2 className="text-sm font-semibold mb-2">Roadmap</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Phased rollout from private beta to regulated public access, including partner and market milestones.
                </p>
              </div>
            </div>
          </AnimationContainer>

          {/* Enterprise technology stack */}
          <AnimationContainer animation="fadeUp" delay={0.4}>
            <div className="mt-16 pt-16 border-t border-border/60">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Infrastructure</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Enterprise-grade technology stack
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
                Built for security, scalability, and seamless global interoperability.
              </p>

              <div className="mt-10 space-y-4">
                {TECH_STACK_LAYERS.map((layer) => (
                  <div
                    key={layer.id}
                    className={`rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6 border-l-4 ${layer.borderClass}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${layer.iconClass}`}
                      >
                        <layer.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground">{layer.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{layer.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {layer.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>
    </main>
  );
}

