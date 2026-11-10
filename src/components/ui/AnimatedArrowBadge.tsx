import React from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedArrowBadgeProps {
  direction?: "right" | "up";
  size?: "sm" | "md";
  variant?: "blue" | "white";
  shadowed?: boolean;
  className?: string;
}

export function AnimatedArrowBadge({
  direction = "right",
  size = "md",
  variant = "blue",
  shadowed = false,
  className,
}: AnimatedArrowBadgeProps) {
  const Icon = direction === "up" ? ArrowUp : ArrowRight;
  const isSmall = size === "sm";

  const slideOutClass =
    direction === "up"
      ? "group-hover:-translate-y-8 group-hover:opacity-0"
      : isSmall
      ? "group-hover:translate-x-7 group-hover:opacity-0"
      : "group-hover:translate-x-8 group-hover:opacity-0";

  const slideInStartClass =
    direction === "up"
      ? "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
      : isSmall
      ? "-translate-x-7 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
      : "-translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100";

  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full shrink-0 transition-colors duration-200",
        isSmall ? "h-[26px] w-[26px]" : "h-8 w-8",
        variant === "blue"
          ? "bg-[#185adb] text-white group-hover:bg-[#1348b5]"
          : "bg-white text-[#185adb]",
        shadowed && "shadow-sm",
        className
      )}
    >
      <Icon
        className={cn(
          "stroke-[2.5] transition-all duration-300 ease-out",
          isSmall ? "h-3.5 w-3.5" : "h-4 w-4",
          slideOutClass
        )}
      />
      <Icon
        className={cn(
          "absolute stroke-[2.5] transition-all duration-300 ease-out",
          isSmall ? "h-3.5 w-3.5" : "h-4 w-4",
          slideInStartClass
        )}
      />
    </span>
  );
}

