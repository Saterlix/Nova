"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, Zap, Gift, Percent, Shield, TrendingUp, BarChart3, Headphones, BadgeCheck, Scale } from "lucide-react";

export function WhyNova() {
    const { t } = useLanguage();

    const icons = [
        Shield,       // Complex turn-key
        Scale,        // Scale & Goals
        BarChart3,    // Measurable Result
        Headphones,   // SLA Support
        BadgeCheck,   // Smooth Launch
        TrendingUp    // Fair Commerce - using TrendingUp or similar? Maybe Handshake if available, or Percent.
    ];

    const footerIcons = [
        Clock,  // Audit time
        Zap,    // SLA Reaction
        Gift,   // Bonus
        Percent // 50% offset
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section id="why-nova" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t.whyNova.header}</h2>
                    <p className="text-xl text-muted-foreground">{t.whyNova.subheader}</p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-16"
                >
                    {t.whyNova.cards.map((card, index) => {
                        const Icon = icons[index % icons.length];
                        return (
                            <motion.div key={index} variants={item}>
                                <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <CardHeader className="p-3 md:p-6">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-sm md:text-xl font-semibold mb-1 md:mb-2 leading-tight">{card.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                                        <p className="text-xs md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">
                                            {card.body}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer Evidence Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-border pt-12">
                    {t.whyNova.footer.map((text, index) => {
                        const Icon = footerIcons[index % footerIcons.length];
                        return (
                            <div key={index} className="flex flex-col items-center text-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground font-bold">
                                    <Icon className="w-5 h-5 text-secondary-foreground" />
                                </div>
                                <span className="font-medium text-foreground">{text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
