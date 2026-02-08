"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Globe, Calendar, Briefcase, Zap } from "lucide-react";

interface PricingModalProps {
    trigger: React.ReactNode;
}

export function PricingModal({ trigger }: PricingModalProps) {
    const { t } = useLanguage();

    const plans = [
        {
            id: "hourly",
            icon: <Clock className="w-6 h-6 text-blue-500" />,
            title: t.pricing.hourly.title,
            price: t.pricing.hourly.price,
            desc: t.pricing.hourly.desc,
            popular: false
        },
        {
            id: "online",
            icon: <Globe className="w-6 h-6 text-green-500" />,
            title: t.pricing.online.title,
            price: t.pricing.online.price,
            desc: t.pricing.online.desc,
            popular: true
        },
        {
            id: "weekly",
            icon: <Calendar className="w-6 h-6 text-purple-500" />,
            title: t.pricing.weekly.title,
            price: t.pricing.weekly.price,
            desc: t.pricing.weekly.desc,
            popular: false
        },
        {
            id: "monthly",
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: t.pricing.monthly.title,
            price: t.pricing.monthly.price,
            desc: t.pricing.monthly.desc,
            popular: false
        },
        {
            id: "individual",
            icon: <Briefcase className="w-6 h-6 text-gray-500" />,
            title: t.pricing.individual.title,
            price: t.pricing.individual.price,
            desc: t.pricing.individual.desc,
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
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full lg:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col p-0">

                <div className="p-6 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">{t.pricing.title}</DialogTitle>
                        <DialogDescription className="text-center">
                            {t.pricing.subtitle}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Optimized Flex Layout: Wraps nicely and stays centered, preventing squished cards */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8 pb-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col hover:shadow-lg transition-shadow duration-300
                                    w-full 
                                    sm:w-[calc(50%-12px)] 
                                    lg:w-[calc(33.333%-16px)] 
                                    xl:w-[240px] 
                                    2xl:w-[260px]
                                    min-w-[240px]
                                    ${plan.popular ? 'border-primary shadow-md ring-1 ring-primary' : 'border-border'}
                                `}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10">
                                        Popular
                                    </div>
                                )}
                                <CardHeader className="pb-4">
                                    <div className="mb-3 p-3 bg-muted/50 rounded-xl w-fit border shadow-sm">
                                        {plan.icon}
                                    </div>
                                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                                    <CardDescription className="text-sm min-h-[40px] flex items-center">
                                        {plan.desc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow pt-0 pb-4">
                                    <div className="text-2xl font-bold text-primary">
                                        {plan.price}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 mt-auto">
                                    <Button
                                        onClick={() => {
                                            scrollToContact();
                                        }}
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                    >
                                        {t.pricing.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </div>
            </DialogContent>

        </Dialog>
    );
}
