"use client";

import React from "react";
import { Send } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-foreground text-primary-foreground py-12 mt-20">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4">NOVA</h3>
                    <p className="text-primary-foreground/70 text-sm">
                        IT Infrastructure that helps you grow.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Contact</h4>
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://t.me/Nova_BusinessBOT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            @Nova_BusinessBOT
                        </a>
                        <a
                            href="https://t.me/Folintest"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            @Folintest
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Address</h4>
                    <p className="text-sm text-primary-foreground/70">Tashkent, Uzbekistan</p>
                </div>

                <div>
                    <p className="text-xs text-primary-foreground/50 mt-10">
                        © {new Date().getFullYear()} NOVA Outsourcing. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
