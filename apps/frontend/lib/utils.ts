import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL ="https://betteruptime-api-381458569054.asia-south1.run.app"
// "https://betteruptime-api-381458569054.asia-south1.run.app"