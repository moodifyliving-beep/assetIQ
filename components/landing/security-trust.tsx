"use client";

import { Check, FileCheck, BadgeCheck, Network, Umbrella } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimationContainer from "./global/animation-container";
import Wrapper from "./global/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import SectionBadge from "@/components/ui/section-badge";

const securityFeatures = [
  { title: "Smart Contract Audited", description: "All smart contracts independently audited by top security firms", icon: FileCheck },
  { title: "Whitelisted NFTs", description: "Curated property NFTs with verified ownership and legal standing", icon: BadgeCheck },
  { title: "On-Chain Transparency", description: "Every transaction recorded immutably on the blockchain", icon: Network },
  { title: "Insurance Coverage", description: "Portfolio protection and insurance options for peace of mind", icon: Umbrella },
];

export default function SecurityTrust() {
  const shieldRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shieldRef.current) return;
    const rect = shieldRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Wrapper className="py-20 lg:py-32">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <AnimationContainer animation="fadeUp" delay={0.2}>
          <SectionBadge title="Security & Trust" />
        </AnimationContainer>
        <AnimationContainer animation="fadeUp" delay={0.3}>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">Enterprise-grade security</h2>
        </AnimationContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimationContainer animation="fadeRight" delay={0.4}>
          <motion.div
            ref={shieldRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY }}
            className="rounded-3xl bg-[#191919] p-8 flex items-center justify-center min-h-[300px]"
          >
            <div className="text-6xl">🛡️</div>
          </motion.div>
        </AnimationContainer>
        <div className="flex flex-col gap-4">
          {securityFeatures.map((feature, index) => (
            <AnimationContainer key={index} animation="fadeLeft" delay={0.5 + index * 0.1}>
              <Card className="bg-[#191919] border-border/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <feature.icon className="size-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Check className="size-5 text-primary shrink-0 ml-auto" />
                </CardContent>
              </Card>
            </AnimationContainer>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
