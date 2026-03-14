import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const extractTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getTimeDifference = (start: string | Date, end: string | Date) => {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const result = [];

  if (diffDays > 0) result.push(`${diffDays} day${diffDays > 1 ? "s" : ""}`);
  if (diffHours > 0)
    result.push(`${diffHours} hour${diffHours > 1 ? "s" : ""}`);
  if (diffMinutes > 0 && diffDays === 0)
    result.push(`${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`);

  return result.length > 0 ? result.join(" ") : "0 minutes";
};
