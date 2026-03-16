"use client";

import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TermsPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleAccept = () => {
    if (!accepted) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("termsAccepted", new Date().toISOString());
    }
    toast.success("You have accepted the Terms of Service.");
    router.push("/");
  };
  return (
    <main className="w-full min-h-screen bg-background">
      <LandingNavbar />

      <section className="pt-28 pb-16">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Legal</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Terms of service</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: March 2026</p>
          </AnimationContainer>

          <div className="mt-12 max-w-3xl space-y-8 text-sm text-muted-foreground leading-relaxed">
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of terms</h2>
                <p>
                  By accessing or using the Moodify platform, website, or services (&quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use our Services. We may update these Terms; continued use after changes constitutes acceptance.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.25}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">2. Description of services</h2>
                <p>
                  Moodify provides a platform for exploring, learning about, and (when available) participating in tokenized real estate investments. Our Services may include property listings, wallet connectivity, dashboards, educational content, and related features. Services are subject to change and may be in beta or limited availability.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.3}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">3. Eligibility</h2>
                <p>
                  You must be at least 18 years old and legally capable of entering into a binding agreement. Use of our Services may be restricted in certain jurisdictions. You are responsible for complying with the laws of your country or region. Investment-related features may require accreditation or additional verification where required by law.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.35}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">4. Account and wallet</h2>
                <p>
                  When you connect a wallet or create an account, you are responsible for maintaining the security of your credentials. We do not store your private keys. You are solely responsible for activity that occurs through your wallet or account. You must notify us immediately of any unauthorized use.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.4}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">5. No investment advice</h2>
                <p>
                  Nothing on our platform constitutes legal, financial, tax, or investment advice. All content is for informational purposes only. You should conduct your own research and consult qualified professionals before making investment decisions. Past performance does not guarantee future results.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.45}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">6. Risks</h2>
                <p className="mb-2">
                  Tokenized real estate and blockchain-based investments carry risks, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Market, liquidity, and volatility risk.</li>
                  <li>Regulatory and legal uncertainty.</li>
                  <li>Smart contract and technology risk.</li>
                  <li>Property-specific and counterparty risk.</li>
                </ul>
                <p className="mt-2">You use our Services at your own risk. We are not liable for investment losses.</p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.5}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">7. Prohibited conduct</h2>
                <p className="mb-2">You must not:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Violate any law or regulation.</li>
                  <li>Use the platform for fraud, money laundering, or other illicit activity.</li>
                  <li>Attempt to compromise our systems or other users&apos; accounts.</li>
                  <li>Copy, scrape, or misuse our content or data without permission.</li>
                  <li>Impersonate others or misrepresent your identity.</li>
                </ul>
                <p className="mt-2">We may suspend or terminate your access for violations.</p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.55}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">8. Intellectual property</h2>
                <p>
                  Moodify and its content, branding, and technology are owned by us or our licensors. You may not use our trademarks or content without prior written consent. You retain rights to content you submit, but grant us a license to use it for operating the platform.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.6}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">9. Limitation of liability</h2>
                <p>
                  To the fullest extent permitted by law, Moodify and its affiliates, officers, and agents are not liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits or data, arising from your use of the Services. Our total liability is limited to the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.65}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">10. Indemnification</h2>
                <p>
                  You agree to indemnify and hold Moodify, its affiliates, and their respective officers, directors, and employees harmless from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Services or violation of these Terms.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.7}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">11. Governing law</h2>
                <p>
                  These Terms are governed by the laws of Ghana, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Ghana. If any provision is found unenforceable, the remainder remains in effect.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.75}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">12. Contact</h2>
                <p>
                  For questions about these Terms, contact us at{" "}
                  <a href="mailto:info@moodify.site" className="text-primary hover:underline">info@moodify.site</a>
                  , or write to Moodify, East Legon, Accra, Ghana.
                </p>
              </section>
            </AnimationContainer>
          </div>

          <AnimationContainer animation="fadeUp" delay={0.8}>
            <div className="mt-12 pt-8 border-t border-border/60 space-y-6">
              <div className="flex flex-col gap-4 p-4 rounded-lg border border-border bg-muted/30 max-w-xl">
                <h3 className="text-base font-semibold text-foreground">Agreement</h3>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox
                    checked={accepted}
                    onCheckedChange={(checked) => setAccepted(checked === true)}
                    className="mt-0.5 border-2 border-foreground/50"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    I have read and agree to the Terms of Service and understand that by using Moodify I am bound by these terms.
                  </span>
                </label>
                <Button
                  onClick={handleAccept}
                  disabled={!accepted}
                  size="sm"
                  className="w-fit"
                >
                  Accept and continue
                </Button>
              </div>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-sm text-primary hover:underline">Privacy policy</Link>
                <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
              </div>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      <Footer />
    </main>
  );
}
