import type { Metadata } from "next";
import {
  Fraunces,
  Playfair_Display,
  EB_Garamond,
  Crimson_Text,
  Work_Sans,
  Inter,
  Karla,
  DM_Sans,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-karla",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
});

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
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        workSans.variable,
        inter.variable,
        karla.variable,
        dmSans.variable,
        fraunces.variable,
        playfair.variable,
        garamond.variable,
        crimson.variable
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem('rl-tweaks')||'{}');var el=document.documentElement;if(t.theme)el.dataset.theme=t.theme;if(t.fontPairing)el.dataset.pairing=t.fontPairing;if(t.surprise)el.dataset.surprise='on';var ac={terracotta:['#b66b4a','#fff'],oxblood:['#7a2e2e','#fff'],forest:['#3a5a3a','#fff'],ink:['#1a1613','#faf7f2'],indigo:['#3a4a7a','#fff'],ochre:['#b58a3a','#fff']};var a=ac[t.accent];if(a){el.style.setProperty('--accent',a[0]);el.style.setProperty('--accent-ink',a[1])}if(t.density==='compact')el.style.setProperty('--density','0.7')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}