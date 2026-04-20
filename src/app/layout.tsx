import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SK Crown Conventions | Premium SaaS Dashboard",
  description: "Luxury financial management and invoice builder for SK Crown Conventions, Warangal.",
};

import { Toaster } from 'sonner';
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full bg-background dark:bg-charcoal text-foreground flex overflow-x-hidden`}>
        <Providers>
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
            <Topbar />
            <div className="flex-1 p-4 md:p-8">
              {children}
            </div>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'font-bold rounded-2xl border-none shadow-premium bg-white/90 dark:bg-charcoal/90 backdrop-blur-xl',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
