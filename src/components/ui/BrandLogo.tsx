import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/config/site";

interface BrandLogoProps {
  variant?: "blue" | "white";
  shape?: "bare" | "circle";
  shadowed?: boolean;
  textClassName?: string;
  label?: string;
}

export function BrandLogo({
  variant = "blue",
  shape = "bare",
  shadowed = false,
  textClassName,
  label = SITE_CONFIG.name,
}: BrandLogoProps) {
  const isBlue = variant === "blue";
  const isCircled = shape === "circle";
  const logoSrc =
    !isBlue || isCircled
      ? "/images/white-logo-creatify.svg"
      : "/images/blue-logo-creatify.svg";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity"
    >
      {isCircled ? (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isBlue ? "bg-[#2364e2]" : "bg-white/15 ring-1 ring-white/40",
            shadowed && "shadow-sm"
          )}
        >
          <Image
            src={logoSrc}
            alt=""
            width={16}
            height={19}
            unoptimized
            loading="eager"
            className="h-[18px] w-auto -translate-x-[0.5px] object-contain select-none"
          />
        </span>
      ) : (
        <Image
          src={logoSrc}
          alt=""
          width={24}
          height={28}
          unoptimized
          loading="eager"
          className={cn(
            "h-[26px] sm:h-[28px] w-auto shrink-0 object-contain select-none",
            shadowed && "drop-shadow-xs"
          )}
        />
      )}
      <span
        className={cn(
          "text-[16px] font-semibold tracking-tight",
          isBlue ? "text-zinc-950" : "text-white text-[17px]",
          textClassName
        )}
      >
        {label}
      </span>
    </Link>
  );
}
