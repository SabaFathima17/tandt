import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import * as Sentry from '@sentry/nextjs';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export function generateMetadata(): Metadata {
  return {
    title: "Train & Test",
    description: "Train yourself. Test your skills. Get hired.",
    other: {
      ...Sentry.getTraceData()
    }
  };
}