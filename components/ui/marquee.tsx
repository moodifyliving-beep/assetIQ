"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, cloneElement, isValidElement, Children } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        { "flex-row": !vertical, "flex-col": vertical },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, repeatIndex) => (
          <div
            key={`marquee-repeat-${repeatIndex}`}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {Children.map(children, (child, childIndex) => {
              if (isValidElement(child)) {
                const originalKey = child.key;
                const uniqueKey =
                  originalKey != null && originalKey !== ""
                    ? `marquee-r${repeatIndex}-c${childIndex}-${String(originalKey)}`
                    : `marquee-r${repeatIndex}-c${childIndex}`;
                return cloneElement(child, { key: uniqueKey } as Record<string, unknown>);
              }
              if (child != null && child !== false) {
                return (
                  <span key={`marquee-r${repeatIndex}-t${childIndex}`} style={{ display: "contents" }}>
                    {child}
                  </span>
                );
              }
              return null;
            })}
          </div>
        ))}
    </div>
  );
}
