import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BASE_ORIGIN } from "@/utilities/constants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s \u2013 Line Avatars",
    default: "Line Avatars",
  },
  metadataBase: new URL(BASE_ORIGIN),
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} h-full text-zinc-900`}>
      <body className="h-full">
        <div className="w-full max-w-xl mx-auto min-h-full flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
