"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Globe, Calendar, Briefcase, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Pricing() {
    const { t } = useLanguage();

    const plans = [
        {
            id: "hourly",
            icon: <Clock className="w-6 h-6 text-blue-500" />,
            title: t.pricing.hourly.title,
            price: t.pricing.hourly.price,
            desc: t.pricing.hourly.desc,
            features: [],
            popular: false
        },
        {
            id: "online",
            icon: <Globe className="w-6 h-6 text-green-500" />,
            title: t.pricing.online.title,
            price: t.pricing.online.price,
            desc: t.pricing.online.desc,
            features: [],
            popular: true
        },
        {
            id: "weekly",
            icon: <Calendar className="w-6 h-6 text-purple-500" />,
            title: t.pricing.weekly.title,
            price: t.pricing.weekly.price,
            desc: t.pricing.weekly.desc,
            features: [],
            popular: false
        },
        {
            id: "monthly",
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: t.pricing.monthly.title,
            price: t.pricing.monthly.price,
            desc: t.pricing.monthly.desc,
            features: [],
            popular: false
        },
        {
            id: "individual",
            icon: <Briefcase className="w-6 h-6 text-gray-500" />,
            title: t.pricing.individual.title,
            price: t.pricing.individual.price,
            desc: t.pricing.individual.desc,
            features: [],
            popular: false
        }
    ];

    const scrollToContact = () => {
        const element = document.getElementById("contact-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="pricing" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{t.pricing.title}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t.pricing.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex"
                        >
                            <Card className={`relative flex flex-col w-full hover:shadow-lg transition-shadow duration-300 ${plan.popular ? 'border-primary shadow-md' : 'border-border'}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                        Popular
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="mb-4 p-3 bg-background rounded-full w-fit border shadow-sm">
                                        {plan.icon}
                                    </div>
                                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                                    <CardDescription className="mt-2 text-sm h-10">
                                        {plan.desc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-2xl font-bold text-primary mb-4">
                                        {plan.price}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={scrollToContact}
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                    >
                                        {t.pricing.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
