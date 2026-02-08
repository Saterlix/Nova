"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PricingModal } from "@/components/ui/pricing-modal";

export function Hero() {
    const { t } = useLanguage();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="hero" className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium mb-6 border border-secondary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        {t.hero.brand}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        <span className="block">{t.hero.headline}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t.hero.subheadline}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => scrollToSection("contact-form")}
                            size="lg"
                            className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                        >
                            {t.hero.getAudit}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <PricingModal
                            trigger={
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8 text-base rounded-full border-primary/20 hover:bg-primary/5 transition-transform hover:scale-105"
                                >
                                    {t.hero.viewPlans}
                                </Button>
                            }
                        />
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{t.hero.stats.sla}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{t.hero.stats.monitoring}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{t.hero.stats.certified}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
