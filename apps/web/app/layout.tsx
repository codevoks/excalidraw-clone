import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppBar } from "../components/layout/app-bar";
import { ConditionalFooter } from "../components/layout/conditional-footer";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Turborepo Auth Template",
  description: "Production-ready starter with Turborepo, Next.js and auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${playfair.variable} font-[family-name:var(--font-sans)]`}
      >
        <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
          <AppBar />
          <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-24 sm:px-6 lg:px-8">
            {children}
          </main>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
