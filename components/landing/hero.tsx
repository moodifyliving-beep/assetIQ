"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import AnimationContainer from "./global/animation-container";
import Images from "./global/images";
import Wrapper from "./global/wrapper";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import SectionBadge from "@/components/ui/section-badge";

const companies = [Images.comp1, Images.comp2, Images.comp3, Images.comp4, Images.comp5, Images.comp6];

export default function Hero() {
  const { t } = useLanguage();
  return (
    <Wrapper className="pt-20 lg:pt-32 relative min-h-screen w-full h-full flex-1 lg:max-w-screen-2xl">
      <div className="flex flex-col lg:flex-row w-full h-full lg:gap-16 min-w-0">
        <div className="flex flex-col items-start gap-10 py-8 w-full min-w-0">
          <div className="flex flex-col items-start gap-4">
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <SectionBadge title={t("hero.badge")} />
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.4}>
              <h1 className="text-5xl lg:text-6xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-neutral-500">{t("hero.title")}</h1>
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.6}>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground">{t("hero.description")}</p>
            </AnimationContainer>
          </div>
          <AnimationContainer animation="fadeUp" delay={0.8}>
            <div className="w-full">
              <Link href="/signup">
                <Button size="lg" className="w-full md:w-auto">{t("common.startFreeTrial")}</Button>
              </Link>
            </div>
          </AnimationContainer>
          <AnimationContainer animation="fadeUp" delay={1}>
            <div className="flex flex-col items-start gap-4 py-4">
              <p className="text-sm md:text-base text-muted-foreground">{t("hero.trustedBy")}</p>
              <div className="w-full relative max-w-full lg:max-w-lg">
                <Marquee className="[--duration:40s] select-none [--gap:2rem]">
                  {[...Array(10)].map((_, index) => (
                    <div key={`company-${index}`} className="flex items-center justify-center text-muted-foreground h-16">
                      {companies[index % companies.length]({ className: "w-auto h-5" })}
                    </div>
                  ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 -right-1 w-1/3 bg-gradient-to-l from-background z-40" />
                <div className="pointer-events-none absolute inset-y-0 -left-1 w-1/3 bg-gradient-to-r from-background z-40" />
              </div>
            </div>
          </AnimationContainer>
        </div>
        <AnimationContainer animation="fadeRight" delay={0.4}>
          <div className="flex flex-col items-start justify-start w-full min-w-0 flex-1 overflow-hidden">
            <div className="w-full max-w-full lg:max-w-[1200px] lg:aspect-[1.3884514435695539/1] relative">
              <div className="pointer-events-none hidden lg:block absolute inset-y-0 right-1/4 w-1/3 h-full bg-gradient-to-l from-background z-50" />
              <div className="relative w-full h-full min-h-0">
                <Image
                  src="/images/dashboard.png"
                  alt="Dashboard preview"
                  width={1024}
                  height={1024}
                  sizes="(max-width: 1024px) 100vw, min(1200px, calc(100vw - 8rem))"
                  className="w-full h-auto object-contain rounded-xl lg:rounded-2xl"
                />
              </div>
            </div>
          </div>
        </AnimationContainer>
      </div>
      <AnimationContainer animation="scaleUp" delay={1.2} className="absolute w-2/3 h-auto -top-[8%] left-1/4 -z-10">
        <Image src="/images/hero-gradient.svg" alt="hero" width={1024} height={1024} className="object-cover w-full h-auto" />
      </AnimationContainer>
    </Wrapper>
  );
}
