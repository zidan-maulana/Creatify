import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitas penggabungan class Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
