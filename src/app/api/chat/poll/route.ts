import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
const EMPLOYEE_ID = process.env.TELEGRAM_EMPLOYEE_ID;

export const dynamic = 'force-dynamic';

async function handleCallback(callbackQuery: any) {
    if (!BOT_TOKEN || !EMPLOYEE_ID) return;

    try {
        // 1. Acknowledge the click (stop spinner)
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQuery.id,
            })
        });

        // 2. Extract Session ID from the original message text
        const originalText = callbackQuery.message?.text || '';
        const match = originalText.match(/#id:(sess_[a-zA-Z0-9]+)/);
        const sessionId = match ? match[1] : null;

        if (sessionId) {
            // 3. Send a ForceReply message
            // The prompt MUST contain the #id so that when the admin replies to it, 
            // the main polling loop can detect the ID in the reply-context.
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: EMPLOYEE_ID,
                    text: `Ответ для #id:${sessionId}\n✍️ Напишите сообщение и отправьте:`,
                    reply_markup: {
                        force_reply: true,
                        input_field_placeholder: "Напишите ответ..."
                    }
                })
            });
        }
    } catch (e) {
        console.error("Failed to handle callback", e);
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

    // Include callback_query in allowed updates
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=50&allowed_updates=["message","callback_query"]`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();

        if (!data.ok || !data.result) {
            return NextResponse.json({ updates: [] });
        }

        // Process Callbacks (Admin clicked "Reply")
        const callbacks = data.result.filter((u: any) => u.callback_query);
        for (const cb of callbacks) {
            // Check if this callback has already been processed/is old to avoid loops? 
            // Updates offset usually handles this in long-polling, but here we can't offset.
            // However, Telegram generally drops processed callbacks eventually. 
            // In this specialized stateless poll, we might re-process if we aren't careful with offsets.
            // BUT: Since we don't store offset, we rely on Vercel's execution. 
            // We will just process. Duplicate ForceReply prompts are "okay" vs missing them.
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
                // The reply might be to the Original Message OR to the Prompt Message.
                // Both contain #id:sessionId
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
