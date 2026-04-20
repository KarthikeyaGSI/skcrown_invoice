import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function calculateGST(amount: number) {
  const cgst = amount * 0.025; // 2.5% CGST
  const sgst = amount * 0.025; // 2.5% SGST
  const total = amount + cgst + sgst;
  return {
    cgst,
    sgst,
    totalGST: cgst + sgst,
    total
  };
}

