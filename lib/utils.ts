import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays, isValid } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));
    return found
      ? found
      : { date: day, income: 0, expenses: 0 };
  });
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

// ✅ Safe date parsing function
export function parseSafeDate(date: string | Date | undefined, defaultValue: Date): Date {
  if (!date) return defaultValue;
  const parsedDate = date instanceof Date ? date : new Date(date);
  return isValid(parsedDate) ? parsedDate : defaultValue;
}

// ✅ Improved formatDateRange function with validation
export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const from = parseSafeDate(period?.from, defaultFrom);
  const to = parseSafeDate(period?.to, defaultTo);

  if (!isValid(from) || !isValid(to)) {
    console.error("Invalid date range:", { from, to });
    return "Invalid Date Range";
  }

  return `${format(from, "LLL dd")} - ${format(to, "LLL dd, y")}`;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  return options.addPrefix && value > 0 ? `+${result}` : result;
}
