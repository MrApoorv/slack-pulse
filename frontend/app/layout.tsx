import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals2.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utkarsh Apoorv",
  description: "Slack pulse",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white font-sans`}
      >
        <div className="relative w-full min-h-screen overflow-x-hidden">
          <main className="relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
