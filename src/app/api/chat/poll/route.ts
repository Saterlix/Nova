import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
const EMPLOYEE_ID = process.env.TELEGRAM_EMPLOYEE_ID;

export const dynamic = 'force-dynamic';

async function handleCallback(callbackQuery: any) {
    if (!BOT_TOKEN) return;
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQuery.id,
                text: "⚠️ Чтобы ответить:\n1. Смахните сообщение ВЛЕВО (Reply)\n2. Напишите текст",
                show_alert: true
            })
        });
    } catch (e) {
        console.error("Failed to answer callback", e);
    }
}

export async function GET(req: Request) {
    if (!BOT_TOKEN || !EMPLOYEE_ID) {
        return NextResponse.json({ error: 'Chat configuration missing server-side' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ updates: [] });
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=50&allowed_updates=["message","callback_query"]`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();

        if (!data.ok || !data.result) {
            return NextResponse.json({ updates: [] });
        }

        // Process Callbacks purely for UI feedback (Admin clicked "Reply" button)
        const callbacks = data.result.filter((u: any) => u.callback_query);
        for (const cb of callbacks) {
            await handleCallback(cb.callback_query);
        }

        // Filter Messages for the specific User Session
        const updates = data.result
            .filter((u: any) => {
                if (!u.message) return false;

                // Check if message is from Employee
                const isFromEmployee = String(u.message.chat.id) === String(EMPLOYEE_ID);
                if (!isFromEmployee) return false;

                // CRITICAL: Check if it replies to THIS session
                const replyText = u.message.reply_to_message?.text || '';
                return replyText.includes(`#id:${sessionId}`);
            })
            .map((u: any) => ({
                id: u.message.message_id,
                text: u.message.text || '[Non-text message]',
                date: u.message.date,
                from: 'support'
            }));

        return NextResponse.json({ updates });
    } catch (error) {
        console.error('Chat Poll API Error:', error);
        return NextResponse.json({ updates: [] });
    }
}
