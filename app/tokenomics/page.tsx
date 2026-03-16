import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";

const TOKEN_ROWS = [
  { label: "Token symbol", value: "MOOD" },
  { label: "Total supply (hard cap)", value: "100,000,000 MOOD" },
  { label: "Network", value: "EVM‑compatible L2 (TBD)" },
  { label: "Token type", value: "Utility / governance" },
  { label: "Initial circulating supply", value: "15% of total supply" },
];

const ALLOCATION_ROWS = [
 { label: "Community & incentives", value: "35%" },
 { label: "Strategic partners & ecosystem", value: "25%" },
 { label: "Team & contributors (4‑year vest)", value: "20%" },
 { label: "Treasury & liquidity", value: "15%" },
 { label: "Advisors (2‑year vest)", value: "5%" },
];

export default function TokenomicsPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <section className="pt-28 pb-16">
        <Wrapper className="flex flex-col gap-10">
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Token design (draft)</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">Moodify tokenomics</h1>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                This page outlines the <span className="font-medium text-foreground">draft</span> token design for the
                Moodify ecosystem. Parameters are subject to change as we engage regulators, partners and the
                community during the beta phase.
              </p>
            </div>
          </AnimationContainer>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
                <h2 className="text-lg font-semibold mb-4">Token overview</h2>
                <dl className="space-y-3 text-sm">
                  {TOKEN_ROWS.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="text-right text-foreground font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.25}>
              <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
                <h2 className="text-lg font-semibold mb-4">High‑level goals</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>Align long‑term incentives between investors, partners and the Moodify team.</li>
                  <li>Reward early users for providing liquidity, feedback and high‑quality properties.</li>
                  <li>Gradually decentralize key protocol decisions as the platform matures.</li>
                </ul>
              </div>
            </AnimationContainer>
          </div>

          <AnimationContainer animation="fadeUp" delay={0.3}>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <h2 className="text-lg font-semibold mb-4">Initial allocation (draft)</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <dl className="space-y-3 text-sm">
                  {ALLOCATION_ROWS.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="text-right text-foreground font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Vesting and release schedules will be finalized with legal and compliance advisors. No token sale is
                  currently live; this page is informational only and does not constitute an offer to sell securities or
                  investment advice.
                </p>
              </div>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>
    </main>
  );
}

