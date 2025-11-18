import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Header from "@/components/header";
import { headers } from "next/headers";
import ContextProvider from "@/context";

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
      className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground">
        <ContextProvider cookies={cookies}>
          <Header />
          {children}
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
      </body>
    </html>
  );
}
