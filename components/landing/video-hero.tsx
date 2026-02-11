"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const properties = [
  { name: "Faena Residences Downtown Miami", image: "/images/icon1.jpg" },
  { name: "Raffles Residences The Palm", image: "/images/icon2.jpg" },
  { name: "Chelsea Residences", image: "/images/icon3.jpg" },
];

export default function VideoHero() {
  const { t } = useLanguage();
  return (
    <>
      <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/video/hero1.MP4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>
        <Wrapper className="relative z-10 h-full flex items-center justify-center py-8 sm:py-12 md:py-16">
          <div className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 md:gap-8 w-full px-4">
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <Link href="/dashboard">
                <Button variant="outline" className="bg-neutral-900/80 backdrop-blur-sm border-neutral-700 text-white hover:bg-neutral-800/80 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                  {t("videoHero.badge")}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                </Button>
              </Link>
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.4}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight text-white max-w-5xl">{t("videoHero.title")}</h1>
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.6}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-2xl px-4">{t("videoHero.subtitle")}</p>
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.8}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-xl w-full sm:w-auto">{t("common.getStarted")}</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold backdrop-blur-sm w-full sm:w-auto">
                    {t("common.joinCommunity")}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </AnimationContainer>
          </div>
        </Wrapper>
      </section>
      <section id="contact" className="relative w-full bg-[#101010] -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <Wrapper>
          <AnimationContainer animation="fadeUp" delay={1.2}>
            <Carousel opts={{ align: "start", loop: true, slidesToScroll: 1 }} className="w-full">
              <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4 lg:-ml-6">
                {properties.map((property, index) => (
                  <CarouselItem key={`property-${index}`} className="pl-2 sm:pl-3 md:pl-4 lg:pl-6 basis-[85%] sm:basis-[75%] md:basis-[65%] lg:basis-1/3">
                    <div className="relative group">
                      <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                        <Image src={property.image} alt={property.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 lg:p-8">
                          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white leading-tight">{property.name}</h3>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-1 sm:left-2 md:left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/80 hover:bg-neutral-800/80 border-neutral-700/50 text-white backdrop-blur-md h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 shadow-lg" />
              <CarouselNext className="absolute right-1 sm:right-2 md:right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/80 hover:bg-neutral-800/80 border-neutral-700/50 text-white backdrop-blur-md h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 shadow-lg" />
            </Carousel>
          </AnimationContainer>
        </Wrapper>
      </section>
    </>
  );
}
