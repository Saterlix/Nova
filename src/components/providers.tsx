"use client";

import React from "react";
import { LanguageProvider } from "@/lib/i18n-context";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ThemeProvider>
    );
}
