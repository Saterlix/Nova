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
        // Escape HTML special chars to prevent breakage
        const safeName = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeCompany = company.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Use HTML parse mode which is more robust for user input than Markdown
        const text = `🚀 <b>New Lead (NOVA)</b>\n\n👤 <b>Name:</b> ${safeName}\n📱 <b>Phone:</b> ${phone}\n🏢 <b>Company:</b> ${safeCompany}\n❓ <b>Type:</b> ${type}`;

        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "HTML",
                }),
            });
        } catch (error) {
            console.error("Telegram Error:", error);
            // Don't fail the request to user if notification fails, logs are enough
        }
    } else {
        console.log("Missing Telegram Config:", { token: !!token, chatId });
    }

    return {
        success: true,
        message: "Application received",
    };
}
