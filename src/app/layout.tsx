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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-background flex overflow-x-hidden`}>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
          <Topbar />
          <div className="flex-1 p-4 md:p-8">
            {children}
          </div>
        </main>
      </body>

    </html>
  );
}

