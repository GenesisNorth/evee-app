import { oklchToHex } from "@/lib/color";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function monthlyPayment(
  price: number,
  downPayment: number,
  termMonths: number,
  annualRate = 0.15,
) {
  const principal = Math.max(price - downPayment, 0);
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / termMonths;
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -termMonths);
}

/** Deterministic 3-stop gradient (hex) for a vehicle placeholder image, seeded by name. */
export function gradientColorsFromSeed(seed: string): [string, string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return [oklchToHex(0.28, 0.05, hue), oklchToHex(0.15, 0, 0), oklchToHex(0.11, 0, 0)];
}
