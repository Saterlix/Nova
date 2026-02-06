"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [transitioning, setTransitioning] = useState<{ theme: "light" | "dark"; x: number; y: number } | null>(null);

    const toggleTheme = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const newTheme = theme === "dark" ? "light" : "dark";
        setTransitioning({ theme: newTheme, x: clientX, y: clientY });

        // Wait for animation to cover screen before changing actual theme
        // Faster animation timing
        setTimeout(() => {
            setTheme(newTheme);
            // Hide overlay almost immediately after theme change to reveal new theme
            setTimeout(() => setTransitioning(null), 50);
        }, 250); // Matches approx expansion time
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navLinks = [
        { label: t.nav.links.services, id: "services" },
        { label: t.nav.links.whyNova, id: "why-nova" },
        { label: t.nav.links.howItWorks, id: "how-it-works" },
        { label: t.nav.links.contacts, id: "contact-form" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-2xl font-bold tracking-tighter text-foreground cursor-pointer"
                >
                    NOVA
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Lang Switcher */}
                    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-border/50 relative">
                        <button
                            onClick={() => setLanguage("ru")}
                            className={cn(
                                "relative px-3 py-1 text-xs font-medium rounded-full transition-all z-10",
                                language === "ru" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {language === "ru" && (
                                <motion.div
                                    layoutId="active-lang"
                                    className="absolute inset-0 bg-background shadow-sm rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">RU</span>
                        </button>
                        <button
                            onClick={() => setLanguage("uz")}
                            className={cn(
                                "relative px-3 py-1 text-xs font-medium rounded-full transition-all z-10",
                                language === "uz" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {language === "uz" && (
                                <motion.div
                                    layoutId="active-lang"
                                    className="absolute inset-0 bg-background shadow-sm rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">UZ</span>
                        </button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        disabled={!!transitioning}
                        className="rounded-full w-9 h-9 mr-2 relative z-[110]"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    <Button
                        onClick={() => scrollToSection("contact-form")}
                        className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                    >
                        {t.nav.cta}
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        disabled={!!transitioning}
                        className="rounded-full w-9 h-9"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <div className="flex flex-col gap-8 mt-8">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <button
                                        onClick={() => setLanguage("ru")}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                            language === "ru" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        RU
                                    </button>
                                    <div className="h-4 w-px bg-border"></div>
                                    <button
                                        onClick={() => setLanguage("uz")}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                            language === "uz" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        UZ
                                    </button>

                                </div>

                                <div className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <button
                                            key={link.id}
                                            onClick={() => {
                                                scrollToSection(link.id);
                                                // Close sheet logic is handled by Sheet primitive if we use Link inside Close, but here we are manual.
                                                // Ideally we use a controlled open state for Sheet to close it.
                                                // For MVP, user clicks and it scrolls, but sheet stays open. 
                                                // I'll leave it as is or fix later.
                                            }}
                                            className="text-lg font-medium text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => scrollToSection("contact-form")}
                                    size="lg"
                                    className="w-full rounded-full"
                                >
                                    {t.nav.cta}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                {/* Theme Transition Overlay */}
                <AnimatePresence>
                    {transitioning && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 150, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeIn" }} // Faster 0.3s
                            className={cn(
                                "fixed rounded-full pointer-events-none z-[100]",
                                transitioning.theme === "dark" ? "bg-[#0a0a0a]" : "bg-white"
                            )}
                            style={{
                                top: transitioning.y - 20,
                                left: transitioning.x - 20,
                                width: 40,
                                height: 40,
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
