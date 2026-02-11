import React from "react";
import { cn } from "@/lib/utils";

interface WrapperProps {
  className?: string;
  children: React.ReactNode;
}

export default function Wrapper({ className, children }: WrapperProps) {
  return (
    <section className={cn("h-full mx-auto w-full lg:max-w-screen-xl px-4 lg:px-20", className)}>
      {children}
    </section>
  );
}
