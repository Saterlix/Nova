"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Server, Shield, Network, MonitorSmartphone, Code2, Database } from "lucide-react";

export function Services() {
    const { t } = useLanguage();

    // Define type for Service Items since it's now in JSON
    // We map icons to the array by index. 
    // Icons order must match JSON order: Server, Shield, Network, Database, MonitorSmartphone, Code2
    const iconMap = [Server, Shield, Network, Database, MonitorSmartphone, Code2];

    const services = t.services.items.map((item, index) => ({
        ...item,
        icon: iconMap[index] || Server
    }));



    return (
        <section id="services" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{t.services.title}</h2>
                    <p className="text-muted-foreground">{t.services.subtitle}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {services.map((s, i) => (
                        <Card key={i} className="hover:shadow-lg transition-shadow border-primary/5 bg-muted/20">
                            <CardHeader className="p-3 md:p-6">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                                    <s.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                </div>
                                <CardTitle className="text-sm md:text-xl leading-tight">{s.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 md:line-clamp-none">{s.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
