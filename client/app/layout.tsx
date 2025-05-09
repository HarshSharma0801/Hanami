import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { BrandProvider } from "@/providers/BrandProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <QueryProvider>
            <BrandProvider>{children}</BrandProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
