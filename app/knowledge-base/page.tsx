import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import { BookOpen, Building2, Coins, PieChart, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ARTICLES = [
  {
    id: "real-estate-basics",
    icon: Building2,
    title: "Real estate investing basics",
    description:
      "Real estate has long been one of the most stable and lucrative asset classes. Learn about direct ownership, REITs, crowdfunding, and how modern technology is changing the way we invest in property.",
    points: [
      "Why real estate has historically offered strong returns and diversification.",
      "Traditional barriers: high minimums, illiquidity, and geographic limits.",
      "The shift toward digital and fractional access to property assets.",
    ],
  },
  {
    id: "tokenization",
    icon: Coins,
    title: "What is property tokenization?",
    description:
      "Tokenization converts real-world assets—like a building or land—into digital tokens on a blockchain. Each token represents a fractional interest in the underlying asset, enabling easier transfer, transparency, and programmable rules.",
    points: [
      "How deeds and ownership rights are represented as digital tokens.",
      "Blockchain as a source of truth for ownership and transfers.",
      "Smart contracts automate distributions, compliance, and governance.",
    ],
  },
  {
    id: "fractional-ownership",
    icon: PieChart,
    title: "Fractional property ownership",
    description:
      "Instead of buying an entire property, investors can purchase fractions—sometimes as small as a few hundred dollars—and share in rental income and appreciation. This opens real estate to a much wider audience.",
    points: [
      "How ownership is split into smaller, tradable units.",
      "Rental yield and capital gains flow to fractional owners proportionally.",
      "Lower minimums and better diversification across multiple properties.",
    ],
  },
  {
    id: "rwa",
    icon: Wallet,
    title: "Real-world assets (RWA)",
    description:
      "RWAs are physical or traditional financial assets—real estate, bonds, commodities—that are brought on-chain. The RWA movement is bridging traditional finance and blockchain to create more efficient, transparent markets.",
    points: [
      "Real estate as one of the largest RWA categories by value.",
      "Benefits: transparency, 24/7 settlement, programmable cashflows.",
      "Regulation and compliance remain central to trusted RWA platforms.",
    ],
  },
  {
    id: "benefits-risks",
    icon: Shield,
    title: "Benefits and considerations",
    description:
      "Tokenized and fractional real estate can offer new opportunities, but it also comes with specific risks. Understanding both helps you make informed decisions.",
    points: [
      "Benefits: lower minimums, liquidity potential, diversification, transparency.",
      "Risks: regulatory uncertainty, platform risk, market and property-specific risk.",
      "Why due diligence and regulated platforms matter.",
    ],
  },
  {
    id: "moodify",
    icon: BookOpen,
    title: "How Moodify fits in",
    description:
      "Moodify is building infrastructure to tokenize African real estate, connect developers with global capital, and give investors access to fractional shares with automated compliance and yield distribution.",
    points: [
      "Focus on African markets with strong growth and underserved liquidity.",
      "End-to-end: from property onboarding to investor payouts.",
      "Built for compliance, scalability, and long-term trust.",
    ],
  },
];

export default function KnowledgeBasePage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <LandingNavbar />

      <section className="pt-28 pb-16">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Education</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Knowledge base
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Learn about real estate investing, tokenization, fractional ownership, and how digital infrastructure is reshaping property markets.
            </p>
          </AnimationContainer>

          <div className="mt-12 space-y-8">
            {ARTICLES.map((article, index) => (
              <AnimationContainer key={article.id} animation="fadeUp" delay={0.05 * (index + 2)}>
                <article
                  id={article.id}
                  className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 scroll-mt-24"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <article.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-foreground">{article.title}</h2>
                      <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                        {article.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {article.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </AnimationContainer>
            ))}
          </div>

          <AnimationContainer animation="fadeUp" delay={0.5}>
            <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Want to dive deeper? Explore our{" "}
                <Link href="/whitepaper" className="text-primary hover:underline">
                  whitepaper
                </Link>
                ,{" "}
                <Link href="/tokenomics" className="text-primary hover:underline">
                  tokenomics
                </Link>
                , or{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  get in touch
                </Link>
                .
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/pitch-deck">View pitch deck</Link>
              </Button>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      <Footer />
    </main>
  );
}
