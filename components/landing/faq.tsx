"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/constants/landing";
import { useLanguage } from "@/context/language-context";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import SectionBadge from "@/components/ui/section-badge";

export default function FAQ() {
  const { t } = useLanguage();
  return (
    <Wrapper className="py-20 lg:py-32">
      <div className="flex flex-col items-center text-center gap-4">
        <AnimationContainer animation="fadeUp" delay={0.2}>
          <SectionBadge title={t("faq.badge")} />
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.3}>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">{t("faq.title")}</h2>
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.4}>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">{t("faq.description")}</p>
        </AnimationContainer>
      </div>
      <div className="max-w-3xl mx-auto pt-10">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((item, index) => (
            <AnimationContainer key={`faq-${index}`} animation="fadeUp" delay={0.5 + index * 0.1}>
              <AccordionItem value={`item-${index}`} className="border-none bg-[#191919] rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline py-6 text-base md:text-lg text-left font-normal">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-left">{item.answer}</AccordionContent>
              </AccordionItem>
            </AnimationContainer>
          ))}
        </Accordion>
      </div>
    </Wrapper>
  );
}
