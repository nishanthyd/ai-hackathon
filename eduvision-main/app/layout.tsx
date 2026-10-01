import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnAI — Adaptive AI Learning Platform",
  description: "Personalized AI video learning, interactive tutor, diagnostic testing, and mastery calibration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#060a12] text-white font-sans">{children}</body>
    </html>
  );
}
