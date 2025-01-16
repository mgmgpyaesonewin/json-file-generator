import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractFileName(url: string) {
  try {
    const { pathname } = new URL(url);
    return pathname.split('/').pop();
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

export function formatDateAsFile(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}