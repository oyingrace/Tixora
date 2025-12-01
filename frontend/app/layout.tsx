import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from 'next/dynamic';

// Dynamically import PerformanceMonitor with no SSR
const PerformanceMonitor = dynamic(
  () => import('@/components/performance-monitor'),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

import ContextProvider from '@/context'
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Tixora - Decentralized Event Ticketing",
  description: "NFT-based event ticketing platform built on Ethereum",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContextProvider cookies={cookies}>
            <PerformanceMonitor />
            <Header/>
            {children}
          </ContextProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
        </ThemeProvider>
      </body>
    </html>
  );
}
