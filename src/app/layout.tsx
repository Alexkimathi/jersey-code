import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SupabaseProvider } from "./providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jersey Code | Premium Sports Jerseys",
  description: "Shop premium football, rugby, basketball, and cricket jerseys with fast delivery and secure checkout.",
  metadataBase: new URL("https://jerseystore.example"),
  openGraph: {
    title: "Jersey Code | Premium Sports Jerseys",
    description: "Shop premium football, rugby, basketball, and cricket jerseys with fast delivery and secure checkout.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen text-slate-900`}
      >
        <SupabaseProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SupabaseProvider>
      </body>
    </html>
  );
}
