import { NextResponse } from 'next/server';

// Get Telegram credentials from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        // Check if Telegram credentials are configured
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials are not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Parse the request body
        const body = await request.json();
        const { name, email, message } = body;

        // Validate the required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Format the message for Telegram
        const telegramMessage = `
📬 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
💬 Message: ${message}
    `;

        console.log(`Attempting to send message to Telegram chat ID: ${TELEGRAM_CHAT_ID}`);

        // Send the message to Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    // Remove HTML parse mode as it's not needed for our simple message
                    // parse_mode: 'HTML',
                }),
            }
        );

        const telegramData = await telegramResponse.json();

        if (!telegramResponse.ok) {
            console.error('Telegram API error:', telegramData);

            // Add more specific error handling
            if (telegramData.error_code === 400 && telegramData.description.includes('chat not found')) {
                console.error('Chat not found. Make sure you have started a conversation with your bot on Telegram.');
                return NextResponse.json(
                    { error: 'Telegram configuration error. Please contact the administrator.' },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to send message to Telegram' },
                { status: 500 }
            );
        }

        console.log('Message successfully sent to Telegram');

        // Return success response
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 