import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { ChatWidget } from "@/components/ui/chat-widget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "NOVA Outsourcing",
  description: "IT Infrastructure that helps you grow, not slows you down.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased text-foreground bg-background overflow-x-hidden selection:bg-cyan-500/30`}>
        <Providers>
          {children}
          <ChatWidget />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
