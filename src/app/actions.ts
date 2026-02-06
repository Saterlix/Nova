"use server";

import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(2),
    phone: z.string().min(9),
    company: z.string().min(2),
    type: z.string(),
});

export async function submitLead(prevState: any, formData: FormData) {
    const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        company: formData.get("company"),
        type: formData.get("type"),
    };

    const validatedFields = formSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please valid fields",
        };
    }

    const { name, phone, company, type } = validatedFields.data;

    // Telegram Integration
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
        console.log("Sending to Telegram:", { token: token.slice(0, 5) + "...", chatId }); // LOGGING
        const text = `🚀 *New Lead (NOVA)*\n\n👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n🏢 *Company:* ${company}\n❓ *Type:* ${type}`;

        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "Markdown",
                }),
            });
        } catch (error) {
            console.error("Telegram Error:", error);
            // Don't fail the request to user if notification fails, logs are enough
        }
    } else {
        console.log("Missing Telegram Config:", { token: !!token, chatId });
        console.log("Mock Telegram Send:", data);
    }

    return {
        success: true,
        message: "Application received",
    };
}
