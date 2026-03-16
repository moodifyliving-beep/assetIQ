import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import Wrapper from "@/components/landing/global/wrapper";
import AnimationContainer from "@/components/landing/global/animation-container";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <LandingNavbar />

      <section className="pt-28 pb-16">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Legal</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Privacy policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: March 2026</p>
          </AnimationContainer>

          <div className="mt-12 max-w-3xl space-y-8 text-sm text-muted-foreground leading-relaxed">
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">1. Introduction</h2>
                <p>
                  Moodify (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the Moodify platform and related services for tokenized real estate. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, platform, or services. By using Moodify, you agree to this policy.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.25}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">2. Information we collect</h2>
                <p className="mb-2">We may collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">Account information:</strong> Name, email address, and wallet address when you register or connect a wallet.</li>
                  <li><strong className="text-foreground">Usage data:</strong> How you interact with our platform, including pages visited and actions taken.</li>
                  <li><strong className="text-foreground">Technical data:</strong> IP address, browser type, device information, and similar technical identifiers.</li>
                  <li><strong className="text-foreground">Communication data:</strong> Messages you send via our contact form or other channels.</li>
                  <li><strong className="text-foreground">KYC/verification data:</strong> Documents and information required for identity verification or compliance, where applicable.</li>
                </ul>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.3}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">3. How we use your information</h2>
                <p className="mb-2">We use collected information to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide, operate, and improve our platform and services.</li>
                  <li>Process transactions and manage your account.</li>
                  <li>Comply with legal, regulatory, and anti–money laundering (AML) requirements.</li>
                  <li>Send transactional emails, support responses, and (with consent) marketing communications.</li>
                  <li>Detect and prevent fraud, abuse, and security incidents.</li>
                  <li>Analyze usage to improve user experience and product development.</li>
                </ul>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.35}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">4. Sharing and disclosure</h2>
                <p>
                  We may share your information with service providers (e.g., hosting, analytics, email), regulators, law enforcement when required by law, and partners involved in property transactions or compliance. We do not sell your personal data. Blockchain transactions are public; wallet addresses and on-chain activity may be visible to third parties.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.4}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">5. Data security</h2>
                <p>
                  We implement technical and organizational measures to protect your data. No system is completely secure; you are responsible for securing your wallet and credentials. We will notify you of significant data breaches where required by law.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.45}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">6. Your rights</h2>
                <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Access, correct, or delete your personal data.</li>
                  <li>Object to or restrict certain processing.</li>
                  <li>Data portability.</li>
                  <li>Withdraw consent where processing is based on consent.</li>
                  <li>Lodge a complaint with a supervisory authority.</li>
                </ul>
                <p className="mt-2">Contact us at info@moodify.site to exercise these rights.</p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.5}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">7. Data retention</h2>
                <p>
                  We retain your data for as long as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Regulatory and compliance records may be retained for longer periods.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.55}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">8. Changes to this policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will post the updated version on this page and indicate the date of the last update. Continued use of the platform after changes constitutes acceptance.
                </p>
              </section>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.6}>
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
                <p>
                  For questions about this Privacy Policy or our data practices, contact us at{" "}
                  <a href="mailto:info@moodify.site" className="text-primary hover:underline">info@moodify.site</a>
                  , or write to Moodify, East Legon, Accra, Ghana.
                </p>
              </section>
            </AnimationContainer>
          </div>

          <AnimationContainer animation="fadeUp" delay={0.65}>
            <div className="mt-12 pt-8 border-t border-border/60">
              <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
            </div>
          </AnimationContainer>
        </Wrapper>
      </section>

      <Footer />
    </main>
  );
}
