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
            <DialogContent className="max-w-7xl max-h-[90vh] w-[95vw] overflow-hidden flex flex-col p-0">
                <div className="p-6 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">{t.pricing.title}</DialogTitle>
                        <DialogDescription className="text-center">
                            {t.pricing.subtitle}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-8 pb-4">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col hover:shadow-lg transition-shadow ${plan.popular ? 'border-primary shadow-md ring-1 ring-primary' : 'border-border'}`}
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
                                            // Close dialog first if possible, but radix primitive handles outside click.
                                            // We need to trigger the scroll.
                                            // Since we can't easily access the dialog close here without context,
                                            // we rely on the link behavior or manually finding the close button if needed.
                                            // Actually, adding a DialogClose wrapper or just letting it scroll is fine.
                                            // Better UX: Scroll to contact.
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
