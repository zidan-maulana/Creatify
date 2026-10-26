import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan class Tailwind secara aman dan bebas konflik
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
