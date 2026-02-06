"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { submitLead } from "@/app/actions";
// Removed duplicate import

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "..." : label}
        </Button>
    );
}

export function ContactForm() {
    const { t } = useLanguage();

    async function clientAction(formData: FormData) {
        const result = await submitLead(null, formData);
        if (result.success) {
            toast.success(t.contact.form.success);
            // Reset form logic if needed, usually simple reset via ref or redirect
            (document.getElementById("lead-form") as HTMLFormElement)?.reset();
        } else {
            toast.error("Error submitting form");
        }
    }

    return (
        <section id="contact-form" className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-lg">
                <Card className="shadow-lg border-primary/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-primary">{t.contact.title}</CardTitle>
                        <CardDescription>{t.contact.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="lead-form" action={clientAction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t.contact.form.name}</Label>
                                <Input id="name" name="name" placeholder={t.contact.form.name} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">{t.contact.form.phone}</Label>
                                {/* Using standard input with masking or simple input for now if mask has hydration issues */}
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+998 (__) ___-__-__"
                                    required
                                    maxLength={19}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        // Ensure strict prefix
                                        if (!value.startsWith('998')) {
                                            // If user deletes 998, put it back or handle gracefully
                                            // Simple approach: Always prepend 998 if missing, or just rely on mask logic below
                                            // For this simple MVP, let's just mask whatever numbers they type
                                        }
                                        // Force 998 prefix if empty or starting typing
                                        if (value === '') value = '998';

                                        // Truncate to max length (998 + 9 digits = 12 chars)
                                        if (value.length > 12) value = value.slice(0, 12);

                                        // 998 XX XXX XX XX
                                        const country = value.slice(0, 3);
                                        const operator = value.slice(3, 5);
                                        const part1 = value.slice(5, 8);
                                        const part2 = value.slice(8, 10);
                                        const part3 = value.slice(10, 12);

                                        let formatted = "";
                                        if (country.length > 0) formatted += "+" + country;
                                        if (operator.length > 0) formatted += " (" + operator;
                                        if (operator.length === 2 && part1.length === 0) formatted += ") ";
                                        else if (part1.length > 0) formatted += ") " + part1;

                                        if (part1.length === 3 && part2.length === 0) formatted += "-";
                                        else if (part2.length > 0) formatted += "-" + part2;

                                        if (part2.length === 2 && part3.length === 0) formatted += "-";
                                        else if (part3.length > 0) formatted += "-" + part3;

                                        e.target.value = formatted;
                                    }}
                                    defaultValue="+998"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">{t.contact.form.company}</Label>
                                <Input id="company" name="company" placeholder={t.contact.form.company} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">{t.contact.form.type}</Label>
                                <Select name="type" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.contact.form.type} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="audit">{t.contact.form.types.audit}</SelectItem>
                                        <SelectItem value="support">{t.contact.form.types.support}</SelectItem>
                                        <SelectItem value="project">{t.contact.form.types.project}</SelectItem>
                                        <SelectItem value="other">{t.contact.form.types.other}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <SubmitButton label={t.contact.form.submit} />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
