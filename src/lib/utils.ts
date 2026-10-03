import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function range(length: number): number[] {
  return Array.from({ length: Math.max(0, length) }, (_, i) => i);
}
