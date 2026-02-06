"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Search, FileText, Rocket } from "lucide-react";

export function HowItWorks() {
    const { t } = useLanguage();

    const icons = [ClipboardList, Search, FileText, Rocket];

    return (
        <section id="how-it-works" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{t.howItWorks.title}</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {t.howItWorks.steps.map((step, index) => {
                        const Icon = icons[index % icons.length];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full border-none bg-background shadow-md hover:shadow-lg transition-all relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 md:p-4 text-4xl md:text-6xl font-bold text-muted/20 z-0 opacity-50 md:opacity-100">
                                        {index + 1}
                                    </div>
                                    <CardContent className="pt-4 relative z-10 text-center p-3 md:p-4">
                                        <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform">
                                            <Icon className="w-5 h-5 md:w-8 md:h-8 text-primary" />
                                        </div>
                                        <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 leading-tight">{step.title}</h3>
                                        <p className="text-xs md:text-base text-muted-foreground line-clamp-3 md:line-clamp-none">{step.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
