import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { ChatWidget } from "@/components/ui/chat-widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NOVA Outsourcing",
  description: "IT Infrastructure that helps you grow, not slows you down.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWidget />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
