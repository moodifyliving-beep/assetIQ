"use client";

import { PRICING_PLANS } from "@/constants/landing";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/ui/section-badge";

export default function Pricing() {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <Wrapper id="pricing" className="py-20 lg:py-32">
      <div className="flex flex-col items-center text-center gap-4">
        <AnimationContainer animation="fadeUp" delay={0.2}>
          <SectionBadge title={t("pricing.badge")} />
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.3}>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">{t("pricing.title")}</h2>
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.4}>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">{t("pricing.description")}</p>
        </AnimationContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <span className={cn("text-sm", !isYearly && "font-medium")}>Monthly</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", isYearly ? "bg-primary" : "bg-neutral-700")}
        >
          <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", isYearly ? "translate-x-6" : "translate-x-1")} />
        </button>
        <span className={cn("text-sm", isYearly && "font-medium")}>Yearly</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {PRICING_PLANS.map((plan, index) => (
          <AnimationContainer key={`pricing-${index}`} animation="fadeUp" delay={0.5 + index * 0.1}>
            <div className={cn("relative rounded-3xl bg-[#191919] backdrop-blur-3xl p-8 flex flex-col", plan.popular && "border-2 border-primary")}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-medium rounded-full">{t("pricing.popular")}</div>
              )}
              <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-xl font-medium">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                  <span className="text-muted-foreground">/ {isYearly ? t("pricing.perYear") : t("pricing.perMonth")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? <Check className="size-5 text-primary shrink-0 mt-0.5" /> : <X className="size-5 text-muted-foreground shrink-0 mt-0.5" />}
                    <span className={cn("text-sm", !feature.included && "text-muted-foreground")}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-8">
                <Button variant={plan.popular ? "default" : "outline"} className="w-full">{t("common.getStarted")}</Button>
              </Link>
            </div>
          </AnimationContainer>
        ))}
      </div>
    </Wrapper>
  );
}
