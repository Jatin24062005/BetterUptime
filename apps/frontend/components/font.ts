import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google"

// same pair as the sign-in / sign-up pages
export const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] })
export const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" })