import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

export function formatMillion(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 3) + " tỷ";
  }
  return Math.round(amount / 1_000_000) + " triệu";
}
