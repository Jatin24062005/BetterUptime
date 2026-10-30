import localFont from "next/font/local";

export const display = localFont({
  src: "../public/fonts/bricolage-grotesque.ttf",
  variable: "--font-display",
  display: "swap",
});

export const body = localFont({
  src: "../public/fonts/instrument-sans.ttf",
  variable: "--font-body",
  display: "swap",
});