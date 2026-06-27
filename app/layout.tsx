import type { Metadata } from "next";
import "./globals.css";
import * as Sentry from '@sentry/nextjs';

export function generateMetadata(): Metadata {
  return {
    title: "Train & Test",
    description: "Train yourself. Test your skills. Get hired.",
    other: {
      ...Sentry.getTraceData()
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}