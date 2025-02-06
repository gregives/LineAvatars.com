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
    default: "Line Avatars \u2013 Generate a Notion-style line avatar",
  },
  description:
    "Generate Notion-style line avatars for your social media profile photo. Take a photo and we'll use AI to generate a line avatar for you in 30 seconds, for free!",
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
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
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
