import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRating = (rating: number): number => {
  // Convert from 0-500 scale to 0-5 scale with 1 decimal place
  return Math.round(rating / 10) / 10;
};

export const carTypes = [
  "All Types",
  "Luxury",
  "Sports",
  "SUV",
  "Convertible",
  "Sedan"
];

// Calculate number of days between two dates
export const daysBetween = (startDate: Date, endDate: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
  return diffDays;
};

// Calculate total price for a booking
export const calculateTotalPrice = (price: number, days: number, withDriver: boolean = false): number => {
  // Add 30% if booking with driver
  const driverMultiplier = withDriver ? 1.3 : 1;
  return Math.round(price * days * driverMultiplier);
};
