
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROUP_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not defined");
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Minimal Types
interface TelegramUpdate {
    update_id: number;
    message?: TelegramMessage;
    callback_query?: TelegramCallbackQuery;
}

interface TelegramMessage {
    message_id: number;
    from: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username?: string;
    };
    chat: {
        id: number;
        type: string;
    };
    text?: string;
    reply_to_message?: TelegramMessage;
}

interface TelegramCallbackQuery {
    id: string;
    from: {
        id: number;
        first_name: string;
    };
    message: TelegramMessage;
    data: string;
}

async function sendMessage(chatId: number | string, text: string, decoration: any = {}) {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            ...decoration
        })
    });
}

async function forwardMessage(chatId: string | number, fromChatId: number | string, messageId: number) {
    await fetch(`${TELEGRAM_API}/forwardMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            from_chat_id: fromChatId,
            message_id: messageId
        })
    });
}

async function answerCallbackQuery(callbackQueryId: string) {
    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId })
    });
}

export async function POST(req: Request) {
    try {
        // Parse body
        const update: TelegramUpdate = await req.json();

        // 1. Handle Callback Queries (Button Clicks)
        if (update.callback_query) {
            const query = update.callback_query;
            const chatId = query.message.chat.id;
            const data = query.data;

            // Stop loading animation
            await answerCallbackQuery(query.id);

            if (data === 'instruction') {
                const text = `<b>🤖 Как пользоваться ботом:</b>\n\n1. Нажмите кнопку <b>«Оставить заявку»</b>.\n2. Бот попросит вас написать сообщение.\n3. Опишите вашу задачу или вопрос.\n4. Ваше сообщение мгновенно улетит нашей команде!\n\nМы ответим вам в ближайшее время.`;
                await sendMessage(chatId, text);
            } else if (data === 'apply') {
                // Force Reply to make user's next message a reply to this
                await sendMessage(chatId, "✍️ <b>Напишите ваше сообщение прямо сейчас:</b>\n(Мы перешлем его команде)", {
                    reply_markup: {
                        force_reply: true,
                        input_field_placeholder: "Опишите вашу задачу..."
                    }
                });
            }
            return NextResponse.json({ ok: true });
        }

        // 2. Handle Messages
        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const text = msg.text;

            // Handle Command: /start
            if (text === '/start') {
                await sendMessage(chatId, `👋 <b>Привет, ${msg.from.first_name}!</b>\n\nЯ бот <b>NOVA Outsourcing</b>.\nЧем могу помочь?`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📖 Как пользоваться ботом", callback_data: "instruction" }],
                            [{ text: "📝 Оставить заявку", callback_data: "apply" }]
                        ]
                    }
                });
                return NextResponse.json({ ok: true });
            }

            // Handle Replied Messages (Ideally reply to "ForceReply" prompt)
            // We check if it is a reply to a message from the bot
            if (msg.reply_to_message && msg.reply_to_message.from.is_bot) {

                if (GROUP_CHAT_ID) {
                    // Forward user's message to the group
                    await forwardMessage(GROUP_CHAT_ID, chatId, msg.message_id);

                    // Confirm to user
                    await sendMessage(chatId, "✅ <b>Заявка принята!</b>\nМы свяжемся с вами в ближайшее время.", {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "➕ Создать еще заявку", callback_data: "apply" }]
                            ]
                        }
                    });
                } else {
                    console.error("GROUP_CHAT_ID not set");
                    await sendMessage(chatId, "⚠️ Ошибка конфигурации. Свяжитесь с администратором.");
                }
                return NextResponse.json({ ok: true });
            }

            // Fallback: If user just writes text without clicking "Apply", we could suggest options
            if (!text?.startsWith('/')) {
                // Optional: Auto-forward everything? User said "Submit request -> then leave request".
                // So we strictly follow the flow.
                // But maybe we should be nice.
                // Let's just ignore random chat to avoid spam compliance issues and strict functionality.
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error handling update:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
