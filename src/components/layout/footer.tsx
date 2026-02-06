"use client";

import React from "react";

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
                    <p className="text-sm text-primary-foreground/70">+998 90 123 45 67</p>
                    <p className="text-sm text-primary-foreground/70">info@nova-outsource.uz</p>
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
