import React from "react";
import { cn } from "@/lib/utils";

interface InstagramIconProps {
  className?: string;
}

export function InstagramIcon({ className }: InstagramIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4 stroke-current fill-none stroke-[1.8]", className)}
      viewBox="0 0 24 24"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line
        x1="17.5"
        x2="17.51"
        y1="6.5"
        y2="6.5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

