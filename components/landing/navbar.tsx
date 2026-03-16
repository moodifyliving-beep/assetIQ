"use client";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants/landing";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { RefObject, useRef, useState } from "react";
import AnimationContainer from "./global/animation-container";
import Icons from "./global/icons";
import Wrapper from "./global/wrapper";
import { useLanguage } from "@/context/language-context";

export default function LandingNavbar() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const mobileMenuRef = useClickOutside(() => { if (open) setOpen(false); });

  const { scrollY } = useScroll({
    target: ref as RefObject<HTMLDivElement>,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <header className="fixed w-full top-0 inset-x-0 z-50">
      <motion.div
        animate={{ width: visible ? "40%" : "100%", y: visible ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 40 }}
        style={{ minWidth: "800px" }}
        className={cn(
          "hidden lg:flex bg-transparent self-start items-center justify-between py-4 rounded-full relative z-[50] mx-auto w-full backdrop-blur",
          visible && "bg-background/60 py-2 border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 w-full"
        )}
      >
        <Wrapper className="flex items-center justify-between lg:px-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-semibold text-foreground">moodify</span>
            </Link>
          </motion.div>

          <div className="hidden lg:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-2 text-sm text-muted-foreground font-medium">
            <AnimatePresence>
              <AnimationContainer key="nav-features" animation="fadeDown" delay={0.1 * 0}>
                <div className="relative">
                  <Link href="#features" className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">{t("nav.features")}</Link>
                </div>
              </AnimationContainer>
              <AnimationContainer key="nav-pricing" animation="fadeDown" delay={0.1 * 1}>
                <div className="relative">
                  <Link href="#pricing" className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">{t("nav.pricing")}</Link>
                </div>
              </AnimationContainer>
              <AnimationContainer key="nav-contact" animation="fadeDown" delay={0.1 * 2}>
                <div className="relative">
                  <Link href="/contact" className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">{t("nav.contact")}</Link>
                </div>
              </AnimationContainer>
            </AnimatePresence>
          </div>

          <AnimationContainer animation="fadeLeft" delay={0.1}>
            <div className="flex items-center gap-x-4">
              <Link href="/invest/dashboard">
                <Button>{t("common.dashboard")}</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">{t("common.getStarted")}</Button>
              </Link>
            </div>
          </AnimationContainer>
        </Wrapper>
      </motion.div>

      <motion.div
        animate={{
          y: visible ? 20 : 0,
          borderTopLeftRadius: open ? "0.75rem" : "2rem",
          borderTopRightRadius: open ? "0.75rem" : "2rem",
          borderBottomLeftRadius: open ? "0" : "2rem",
          borderBottomRightRadius: open ? "0" : "2rem",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 50 }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center mx-auto py-4 z-50",
          visible && "bg-neutral-950 w-11/12 border",
          open && "border-transparent"
        )}
      >
        <Wrapper className="flex items-center justify-between lg:px-4">
          <div className="flex items-center justify-between gap-x-4 w-full">
            <AnimationContainer animation="fadeRight" delay={0.1}>
              <Link href="/"><Icons.icon className="w-max h-6" /></Link>
            </AnimationContainer>
            <AnimationContainer animation="fadeLeft" delay={0.1}>
              <div className="flex items-center justify-center gap-x-4">
                <Link href="/signup"><Button size="sm">{t("common.getStarted")}</Button></Link>
                {open ? <XIcon className="text-black dark:text-white" onClick={() => setOpen(!open)} /> : <MenuIcon className="text-black dark:text-white" onClick={() => setOpen(!open)} />}
              </div>
            </AnimationContainer>
          </div>
        </Wrapper>

        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              ref={mobileMenuRef as RefObject<HTMLDivElement>}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex rounded-b-xl absolute top-16 bg-neutral-950 inset-x-0 z-50 flex-col items-start justify-start gap-2 w-full px-4 py-8 shadow-xl shadow-neutral-950"
            >
              <AnimationContainer key="mobile-features" animation="fadeRight" delay={0.1 * 1} className="w-full">
                <Link href="#features" onClick={() => setOpen(false)} className="relative text-neutral-300 hover:bg-neutral-800 w-full px-4 py-2 rounded-lg"><motion.span>{t("nav.features")}</motion.span></Link>
              </AnimationContainer>
              <AnimationContainer key="mobile-pricing" animation="fadeRight" delay={0.1 * 2} className="w-full">
                <Link href="#pricing" onClick={() => setOpen(false)} className="relative text-neutral-300 hover:bg-neutral-800 w-full px-4 py-2 rounded-lg"><motion.span>{t("nav.pricing")}</motion.span></Link>
              </AnimationContainer>
              <AnimationContainer key="mobile-contact" animation="fadeRight" delay={0.1 * 3} className="w-full">
                <Link href="/contact" onClick={() => setOpen(false)} className="relative text-neutral-300 hover:bg-neutral-800 w-full px-4 py-2 rounded-lg"><motion.span>{t("nav.contact")}</motion.span></Link>
              </AnimationContainer>
              <AnimationContainer key="mobile-actions" animation="fadeUp" delay={0.5} className="w-full">
                <Link href="/invest/dashboard" onClick={() => setOpen(false)} className="w-full"><Button variant="default" className="block md:hidden w-full">{t("common.dashboard")}</Button></Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="w-full"><Button variant="default" className="block md:hidden w-full">{t("common.getStarted")}</Button></Link>
              </AnimationContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
