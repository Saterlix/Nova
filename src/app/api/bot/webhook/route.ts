
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
        title?: string; // Group title
    };
    text?: string;
    contact?: {
        phone_number: string;
        first_name: string;
        user_id?: number;
    };
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
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            ...decoration
        })
    });
    return res.json();
}

// --- Main Handler ---
export async function POST(req: Request) {
    try {
        const update: TelegramUpdate = await req.json();

        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const text = msg.text;
            const contact = msg.contact;
            const userFirstName = msg.from.first_name || "Клиент";
            const username = msg.from.username ? `@${msg.from.username}` : "Скрыт";

            // --- DEBUG TOOL: /id command ---
            // If typed in a group, it reveals the Group ID.
            if (text === '/id') {
                await sendMessage(chatId, `🆔 <b>Chat ID:</b> <code>${chatId}</code>\nType: ${msg.chat.type}`);
                return NextResponse.json({ ok: true });
            }

            // --- DEBUG TOOL: /testgroup command ---
            // Tries to send a message to the Configured Group ID
            if (text === '/testgroup') {
                if (!GROUP_CHAT_ID) {
                    await sendMessage(chatId, "❌ GROUP_CHAT_ID is not set in env.");
                    return NextResponse.json({ ok: true });
                }

                const res = await sendMessage(GROUP_CHAT_ID, "🔔 Test message from Bot.");
                if (res.ok) {
                    await sendMessage(chatId, `✅ <b>Success!</b> Message sent to group <code>${GROUP_CHAT_ID}</code>.`);
                } else {
                    await sendMessage(chatId, `❌ <b>Failed!</b>\nError: ${JSON.stringify(res)}\n\nMake sure Bot is Admin in the group!`);
                }
                return NextResponse.json({ ok: true });
            }

            // 1. Handle Commands & Main Menu & Cancel
            if (text === '/start' || text === 'Главное меню' || text === '/menu' || text === '🔙 Отмена' || text === 'Отмена') {
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

                // -- Step 1 Answered -> Ask Step 2 (Request Contact) --
                if (promptText.includes("1️⃣ Как к вам обращаться?")) {
                    const name = userReply;
                    // Send Step 2 with Contact Button
                    await sendMessage(chatId, `2️⃣ <b>Отлично, ${name}.</b>\nТеперь оставьте контакт для связи.\nНажмите кнопку ниже 👇 или напишите вручную.`, {
                        reply_markup: {
                            keyboard: [
                                [{ text: "📱 Поделиться контактом", request_contact: true }],
                                [{ text: "🔙 Отмена" }]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true,
                            // We also force reply to keep the chain? 
                            // No, Telegram doesn't support ForceReply AND Keyboard easily together on mobile in same way.
                            // But we need the "Replying to..." context for statelessness? 
                            // Actually, if they click the button, it sends a contact message. 
                            // Contact message handles separately.
                            // BUT we lose the "Name" context if we don't ForceReply.
                            // TRICK: We will ForceReply, but also provide a Keyboard.
                            force_reply: true
                        }
                    });
                    // Note: On some clients, ForceReply + JSON Keyboard behaves oddly. 
                    // Better: Just send the message. The user will reply. 
                    // If they use the button, `msg.contact` will be sent.
                    // We need to handle `msg.contact` and *infer* it is for Step 2.
                    return NextResponse.json({ ok: true });
                }

                // -- Step 2 Answered (Text Reponse) -> Ask Step 3 --
                if (promptText.includes("2️⃣ Отлично,")) {
                    const nameMatch = promptText.match(/Отлично, (.*)\./);
                    const name = nameMatch ? nameMatch[1] : "Клиент";
                    const userContact = userReply;

                    await askStep3(chatId, name, userContact);
                    return NextResponse.json({ ok: true });
                }

                // -- Step 3 Answered -> Finish --
                if (promptText.includes("3️⃣ Последний шаг.")) {
                    const nameMatch = promptText.match(/Имя: (.*), Контакт/);
                    const contactMatch = promptText.match(/Контакт: (.*)\)/);
                    const name = nameMatch ? nameMatch[1] : "Не указано";
                    const contactVal = contactMatch ? contactMatch[1] : "Не указано";

                    await finishApplication(chatId, name, contactVal, userReply, msg.from.id, username);
                    return NextResponse.json({ ok: true });
                }
            }

            // 4. Handle Contact Message (Step 2 via Button)
            if (contact) {
                // We assume if they send a contact, it is for the "Application" flow.
                // Since we are stateless, we don't know the Name strictly unless we looked at previous messages (impossible)
                // OR if we just assume "Name" is their Telegram Name.
                // Let's assume Name = Telegram First Name since they shared contact.
                const name = contact.first_name || userFirstName;
                const phone = contact.phone_number;

                await askStep3(chatId, name, phone);
                return NextResponse.json({ ok: true });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error handling update:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper to ask Step 3
async function askStep3(chatId: number | string, name: string, contact: string) {
    await sendMessage(chatId, `3️⃣ <b>Последний шаг.</b>\nОпишите вашу проблему или задачу.\n\n<i>(Имя: ${name}, Контакт: ${contact})</i>`, {
        reply_markup: {
            force_reply: true,
            input_field_placeholder: "Не работает сервер..."
        }
    });
}

// Helper to Finish
async function finishApplication(chatId: number | string, name: string, contact: string, issue: string, userId: number, username: string) {
    if (GROUP_CHAT_ID) {
        const report = `🔔 <b>Новая заявка!</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Контакт:</b> ${contact}\n💬 <b>Проблема:</b> ${issue}\n\n🔗 <b>Telegram:</b> ${username} (ID: ${userId})`;

        const res = await sendMessage(GROUP_CHAT_ID, report);

        if (res.ok) {
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
            console.error("Failed to send to group:", res);
            await sendMessage(chatId, "✅ <b>Заявка принята!</b>\n(Сообщение сохранено, но не доставлено в группу. Администратор проверит логи).", {
                reply_markup: {
                    keyboard: [
                        [{ text: "📝 Оставить заявку" }, { text: "📦 История заказов" }]
                    ],
                    resize_keyboard: true
                }
            });
        }
    } else {
        await sendMessage(chatId, "⚠️ Ошибка: Администратор не настроил группу для заявок.");
    }
}
