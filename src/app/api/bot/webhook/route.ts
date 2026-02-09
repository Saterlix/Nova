
import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROUP_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// --- Types ---
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
    from: { id: number; first_name: string };
    message: TelegramMessage;
    data: string;
}

// --- Helpers ---
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

// --- Main Handler ---
export async function POST(req: Request) {
    try {
        const update: TelegramUpdate = await req.json();

        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const text = msg.text;
            const userFirstName = msg.from.first_name || "Клиент";
            const username = msg.from.username ? `@${msg.from.username}` : "Скрыт";

            // 1. Handle Commands & Main Menu
            if (text === '/start' || text === 'Главное меню' || text === '/menu') {
                await sendMessage(chatId, `👋 <b>Привет, ${userFirstName}!</b>\n\nЯ бот поддержки <b>NOVA Outsourcing</b>.\nВыберите действие в меню ниже 👇`, {
                    reply_markup: {
                        keyboard: [
                            [{ text: "📝 Оставить заявку" }, { text: "📦 История заказов" }],
                            [{ text: "📖 Как пользоваться ботом" }]
                        ],
                        resize_keyboard: true,
                        persistent: true
                    }
                });
                return NextResponse.json({ ok: true });
            }

            // 2. Handle Menu Buttons
            if (text === '📖 Как пользоваться ботом') {
                const info = `<b>📖 Инструкция:</b>\n\n1. Нажмите <b>«Оставить заявку»</b>.\n2. Бот задаст вам 3 простых вопроса (Имя, Контакт, Проблема).\n3. После этого заявка сразу уйдет инженерам.\n\nМы работаем 24/7 и ответим максимально быстро!`;
                await sendMessage(chatId, info);
                return NextResponse.json({ ok: true });
            }

            if (text === '📦 История заказов') {
                await sendMessage(chatId, "📭 <b>История заказов пуста.</b>\nВы еще не оставляли заявок через этого бота.");
                return NextResponse.json({ ok: true });
            }

            if (text === '📝 Оставить заявку') {
                // Step 1: Ask Name
                await sendMessage(chatId, "1️⃣ <b>Как к вам обращаться?</b>\n(Напишите ваше имя)", {
                    reply_markup: {
                        force_reply: true,
                        input_field_placeholder: "Иван Иванов"
                    }
                });
                return NextResponse.json({ ok: true });
            }

            // 3. Handle Survey Replies (State Chaining)
            if (msg.reply_to_message && msg.reply_to_message.from.is_bot) {
                const promptText = msg.reply_to_message.text || "";
                const userReply = text || "";

                // -- Step 1 Answered -> Ask Step 2 --
                if (promptText.includes("1️⃣ Как к вам обращаться?")) {
                    const name = userReply;
                    // Send Step 2, embedding Step 1 data (Name) hidden or visible
                    await sendMessage(chatId, `2️⃣ <b>Отлично, ${name}.</b>\nТеперь оставьте контакт для связи (Telegram, телефон или Email).`, {
                        reply_markup: {
                            force_reply: true,
                            input_field_placeholder: "+998 90 ... или @username"
                        }
                    });
                    return NextResponse.json({ ok: true });
                }

                // -- Step 2 Answered -> Ask Step 3 --
                if (promptText.includes("2️⃣ Отлично,")) {
                    // Extract Name from previous prompt logic (simple split or reliable "reply chain" requires DB, but here we parse)
                    // Previous prompt: "2️⃣ Отлично, {Name}.\n..."
                    // We can try to extract names, but it's risky if name has complex chars.
                    // Hack: We trust the parsing OR we just pass state.
                    // Let's Parse:
                    const nameMatch = promptText.match(/Отлично, (.*)\./);
                    const name = nameMatch ? nameMatch[1] : "Клиент";
                    const contact = userReply;

                    await sendMessage(chatId, `3️⃣ <b>Последний шаг.</b>\nОпишите вашу проблему или задачу.\n\n<i>(Имя: ${name}, Контакт: ${contact})</i>`, {
                        reply_markup: {
                            force_reply: true,
                            input_field_placeholder: "Не работает сервер..."
                        }
                    });
                    return NextResponse.json({ ok: true });
                }

                // -- Step 3 Answered -> Finish & Send to Group --
                if (promptText.includes("3️⃣ Последний шаг.")) {
                    // Parse Data from Prompt
                    // Prompt: "...(Имя: {Name}, Контакт: {Contact})"
                    const nameMatch = promptText.match(/Имя: (.*), Контакт/);
                    const contactMatch = promptText.match(/Контакт: (.*)\)/);

                    const name = nameMatch ? nameMatch[1] : "Не указано";
                    const contact = contactMatch ? contactMatch[1] : "Не указано";
                    const issue = userReply;

                    // Send to Admin Group
                    if (GROUP_CHAT_ID) {
                        const report = `🔔 <b>Новая заявка!</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Контакт:</b> ${contact}\n💬 <b>Проблема:</b> ${issue}\n\n🔗 <b>Telegram:</b> ${username} (ID: ${msg.from.id})`;

                        await sendMessage(GROUP_CHAT_ID, report);

                        // Confirmation to User
                        await sendMessage(chatId, "✅ <b>Спасибо! Заявка принята.</b>\nМы скоро свяжемся с вами.", {
                            reply_markup: {
                                keyboard: [
                                    [{ text: "📝 Оставить заявку" }, { text: "📦 История заказов" }],
                                    [{ text: "📖 Как пользоваться ботом" }]
                                ],
                                resize_keyboard: true
                            }
                        });
                    } else {
                        await sendMessage(chatId, "⚠️ Ошибка: Администратор не настроил группу для заявок.");
                    }
                    return NextResponse.json({ ok: true });
                }
            }

            // Default Fallback for random text
            if (!text?.startsWith('/')) {
                // Just show menu again if they are lost
                // Or ignore. Let's ignore to be non-intrusive, but maybe they typed "Help"
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error handling update:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
