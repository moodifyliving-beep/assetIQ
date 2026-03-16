import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";

const PRODUCT_LINKS = [
  { label: "Property Search", href: "/invest/marketplace" },
  { label: "Management Tools", href: "/property/dashboard" },
  { label: "Virtual Tours", href: "#" },
  { label: "Invest Dashboard", href: "/invest/dashboard" },
];

const RESOURCES_LINKS = [
  { label: "Pitch Deck", href: "/pitch-deck" },
  { label: "Tokenomics", href: "/tokenomics" },
  { label: "Whitepaper", href: "/whitepaper" },
  { label: "Knowledge Base", href: "/knowledge-base" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: "https://www.instagram.com/moodifyliving/" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border pt-16 pb-8 md:pb-0 w-full overflow-hidden">
      <Wrapper>
        <AnimationContainer animation="scaleUp" delay={0.2}>
          <div className="absolute -top-1/8 lg:-top-1/2 inset-x-0 mx-auto bg-primary/50 lg:bg-primary/70 rounded-full w-1/2 h-1/4 blur-[6rem] lg:blur-[12rem]" />
        </AnimationContainer>
        <AnimationContainer animation="scaleUp" delay={0.3}>
          <div className="absolute top-0 w-4/5 mx-auto inset-x-0 h-px bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0" />
        </AnimationContainer>
        <div className="grid gap-8 xl:grid-cols-3 xl:gap-8">
          <AnimationContainer animation="fadeRight" delay={0.4}>
            <div className="flex flex-col items-start justify-start md:max-w-[300px]">
              <div className="flex items-center gap-2">
                <Image src="/icons/icon.svg" alt="Assets IQ" width={32} height={32} />
                <span className="text-lg lg:text-xl font-medium">Moodify</span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
              
                <br />
                East Legon, Accra, Ghana
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>info@moodify.site</p>
                <p>+233 532-818-725</p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                {SOCIAL_LINKS.map((social, index) => (
                  <AnimationContainer key={`social-${index}`} animation="fadeUp" delay={0.6 + index * 0.1}>
                    <Link href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                      <social.icon className="size-5" />
                    </Link>
                  </AnimationContainer>
                ))}
              </div>
            </div>
          </AnimationContainer>
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <AnimationContainer animation="fadeUp" delay={0.5}>
                <div>
                  <h3 className="text-base font-medium">Product</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {PRODUCT_LINKS.map((link, index) => (
                      <AnimationContainer key={`product-${index}`} animation="fadeLeft" delay={0.6 + index * 0.1}>
                        <li>
                          <Link href={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                        </li>
                      </AnimationContainer>
                    ))}
                  </ul>
                </div>
              </AnimationContainer>
              <AnimationContainer animation="fadeUp" delay={0.5}>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-base font-medium">Resources</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {RESOURCES_LINKS.map((link, index) => (
                      <AnimationContainer key={`resource-${index}`} animation="fadeLeft" delay={0.7 + index * 0.1}>
                        <li>
                          <Link href={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                        </li>
                      </AnimationContainer>
                    ))}
                  </ul>
                </div>
              </AnimationContainer>
            </div>
            <AnimationContainer animation="fadeUp" delay={0.5}>
              <div>
                <h3 className="text-base font-medium">Company</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {COMPANY_LINKS.map((link, index) => (
                    <AnimationContainer key={`company-${index}`} animation="fadeLeft" delay={0.8 + index * 0.1}>
                      <li>
                        <Link href={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                      </li>
                    </AnimationContainer>
                  ))}
                </ul>
              </div>
            </AnimationContainer>
          </div>
        </div>
        <AnimationContainer animation="fadeUp" delay={1}>
          <div className="mt-16 border-t border-border/40 py-8 flex flex-col md:flex-row items-center justify-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Moodify. All rights reserved.</p>
          </div>
        </AnimationContainer>
      </Wrapper>
    </footer>
  );
}
