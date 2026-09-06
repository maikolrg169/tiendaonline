import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getConfig } from '@/lib/googleSheets';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  
  return {
    title: config.StoreName || "Mi Tienda",
    description: config.StoreDescription || "Catálogo de productos",
    icons: {
      icon: config.FaviconURL || '/favicon.ico',
    }
  };
}

import { ThemeProvider } from "./components/theme-provider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
