import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
const EMPLOYEE_ID = process.env.TELEGRAM_EMPLOYEE_ID;

export async function POST(req: Request) {
    if (!BOT_TOKEN || !EMPLOYEE_ID) {
        return NextResponse.json({ error: 'Chat configuration missing server-side' }, { status: 500 });
    }

    try {
        const { text } = await req.json();
        if (!text) return NextResponse.json({ error: 'Message text is required' }, { status: 400 });

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: EMPLOYEE_ID,
                text: `🌐 Site Visitor:\n${text}`,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Telegram Send Error:', errorText);
            return NextResponse.json({ error: 'Failed to send to Telegram' }, { status: response.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Chat Send API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
