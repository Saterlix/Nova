import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
const EMPLOYEE_ID = process.env.TELEGRAM_EMPLOYEE_ID;

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
    if (!BOT_TOKEN || !EMPLOYEE_ID) {
        return NextResponse.json({ error: 'Chat configuration missing server-side' }, { status: 500 });
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=20`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();

        if (!data.ok || !data.result) {
            return NextResponse.json({ updates: [] });
        }

        // Filter messages specifically FROM the employee ID
        const updates = data.result
            .filter((u: any) => u.message && String(u.message.chat.id) === String(EMPLOYEE_ID))
            .map((u: any) => ({
                id: u.message.message_id, // Telegram message ID
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
