import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import config from "../../amplify_outputs.json";

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

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});