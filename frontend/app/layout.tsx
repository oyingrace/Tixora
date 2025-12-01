// 'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Header from "@/components/header";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { logError } from "@/lib/error-handler";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

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
  const cookies = headersObj.get("cookie");

  return (
    <html
      lang="en"
      className={inter.variable}
    // suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ErrorBoundary
            onError={(error, errorInfo) => {
              logError({
                error,
                componentStack: errorInfo.componentStack,
                context: { type: 'error-boundary', location: 'root-layout' },
              });
            }}
          > */}
            <ContextProvider cookies={cookies}>
              <Header />
              <main>
                {children}
              </main>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </ContextProvider>
          {/* </ErrorBoundary> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
