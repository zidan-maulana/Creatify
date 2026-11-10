import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/config/site";

interface BrandLogoProps {
  variant?: "blue" | "white";
  shadowed?: boolean;
  textClassName?: string;
}

export function BrandLogo({
  variant = "blue",
  shadowed = false,
  textClassName,
}: BrandLogoProps) {
  const isBlue = variant === "blue";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity"
    >
      <div
        className={cn(
          "flex h-[30px] w-[30px] items-center justify-center rounded-full",
          isBlue ? "bg-[#185adb] text-white" : "bg-white text-[#185adb]",
          shadowed && "shadow-sm"
        )}
      >
        <div
          className={cn(
            "h-3.5 w-3.5 rotate-45 rounded-[2px] flex items-center justify-center",
            isBlue ? "bg-white" : "bg-[#185adb]"
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isBlue ? "bg-[#185adb]" : "bg-white"
            )}
          />
        </div>
      </div>
      <span
        className={cn(
          "text-[16px] font-semibold tracking-tight",
          isBlue ? "text-zinc-950" : "text-white text-[17px]",
          textClassName
        )}
      >
        {SITE_CONFIG.name}
      </span>
    </Link>
  );
}
