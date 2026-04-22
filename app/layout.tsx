import type { Metadata } from "next";
import {
  Fraunces,
  Playfair_Display,
  EB_Garamond,
  Crimson_Text,
  Work_Sans,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import { cn } from "@/lib/utils";

/* ✅ Default UI font */
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

/* 🎨 Editorial fonts */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-garamond",
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "Reading Ledger",
  description: "Track your reading like a ledger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        workSans.variable,
        fraunces.variable,
        playfair.variable,
        garamond.variable,
        crimson.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}