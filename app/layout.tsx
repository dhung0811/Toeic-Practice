import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TOEIC Writing Practice",
  description: "Practice TOEIC Writing Parts 1, 2, and 3 with AI-powered feedback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
