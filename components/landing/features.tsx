"use client";

import { FEATURES } from "@/constants/landing";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import SectionBadge from "@/components/ui/section-badge";

export default function Features() {
  const { t } = useLanguage();
  return (
    <Wrapper id="features" className="py-20 lg:py-32">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <AnimationContainer animation="fadeUp" delay={0.2}>
          <SectionBadge title={t("features.badge")} />
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.3}>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">{t("features.title")}</h2>
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.4}>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">{t("features.description")}</p>
        </AnimationContainer>
      </div>
      <div className="flex flex-col gap-6 px-1 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_.65fr] gap-6">
          <AnimationContainer animation="fadeRight" delay={0.5}>
            <div className="relative rounded-3xl bg-[#191919] backdrop-blur-3xl overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <AnimationContainer animation="fadeUp" delay={0.6}>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-medium">{t("features.smartPropertyManagement.title")}</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-md">{t("features.smartPropertyManagement.description")}</p>
                  </div>
                </AnimationContainer>
                <AnimationContainer animation="fadeUp" delay={0.7}>
                  <div className="relative h-60">
                    <Image src={FEATURES[0].image} alt={FEATURES[0].title} fill className="object-contain" />
                  </div>
                </AnimationContainer>
              </div>
            </div>
          </AnimationContainer>
          <AnimationContainer animation="fadeLeft" delay={0.6}>
            <div className="relative rounded-3xl bg-[#191919] backdrop-blur-3xl overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <AnimationContainer animation="fadeUp" delay={0.7}>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-medium">{t("features.realTimeAnalytics.title")}</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-md">{t("features.realTimeAnalytics.description")}</p>
                  </div>
                </AnimationContainer>
                <AnimationContainer animation="fadeUp" delay={0.8}>
                  <div className="relative h-48">
                    <Image src={FEATURES[1].image} alt={FEATURES[1].title} fill className="object-contain" />
                  </div>
                </AnimationContainer>
              </div>
            </div>
          </AnimationContainer>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[.65fr_1fr] gap-6">
          <AnimationContainer animation="fadeRight" delay={0.7}>
            <div className="relative rounded-3xl bg-[#191919] backdrop-blur-3xl overflow-hidden min-h-[350px]">
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <AnimationContainer animation="fadeUp" delay={0.8}>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-medium">{t("features.smartTransactionHub.title")}</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-md">{t("features.smartTransactionHub.description")}</p>
                  </div>
                </AnimationContainer>
                <AnimationContainer animation="fadeUp" delay={0.9}>
                  <div className="relative h-48">
                    <Image src={FEATURES[2].image} alt={FEATURES[2].title} fill className="object-contain" />
                  </div>
                </AnimationContainer>
              </div>
            </div>
          </AnimationContainer>
          <AnimationContainer animation="fadeLeft" delay={0.8}>
            <div className="relative rounded-3xl bg-[#191919] backdrop-blur-3xl overflow-hidden min-h-[350px]">
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <AnimationContainer animation="fadeUp" delay={0.9}>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-medium">{t("features.instantPropertyValuation.title")}</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-md">{t("features.instantPropertyValuation.description")}</p>
                  </div>
                </AnimationContainer>
                <AnimationContainer animation="fadeUp" delay={1}>
                  <div className="relative h-48">
                    <Image src={FEATURES[3].image} alt={FEATURES[3].title} fill className="object-contain" />
                  </div>
                </AnimationContainer>
              </div>
            </div>
          </AnimationContainer>
        </div>
      </div>
    </Wrapper>
  );
}
