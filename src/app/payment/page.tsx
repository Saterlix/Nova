"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
    const handlePayment = () => {
        console.log("Redirecting to payment gateway...");
        toast.info("Redirecting to payment gateway...");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" />
                        Invoice Payment
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Invoice Number</Label>
                        <Input placeholder="INV-2024-001" />
                    </div>
                    <div className="space-y-2">
                        <Label>Amount (UZS)</Label>
                        <Input type="number" placeholder="0" />
                    </div>

                    <div className="flex justify-center gap-4 py-4">
                        {/* Simple Logos Mockup */}
                        <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">Click</div>
                        <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">Payme</div>
                        <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">Visa</div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePayment} className="w-full h-12 text-lg">
                        Pay Securely
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
