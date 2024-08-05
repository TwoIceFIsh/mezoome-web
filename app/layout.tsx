import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "미주미 지수 - mezoo.me",
  description: `인간지표를 추종합니다.`,
  openGraph: {
    images: "https://mezoo.me/logo800400.png"
  }

};

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={cn(inter.className, "size-full ")}>{children}
    </body>
    <Toaster />
    </html>
  );
}