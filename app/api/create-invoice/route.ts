// app/api/create-invoice/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, payload, currency, prices } = await request.json();

    // Замените process.env.BOT_TOKEN на реальный токен вашего бота
    const botToken = "8042001288:AAGIKxiLEljnN6dtYxkohZ_TG30S0zElTU8";
    if (!botToken) {
      return NextResponse.json(
        { error: 'BOT_TOKEN is not configured' },
        { status: 500 }
      );
    }

    // Вызов Telegram Bot API для создания инвойса
    const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        payload,
        provider_token: '', // Пусто для Telegram Stars
        currency,
        prices,
        start_parameter: "start_parameter"
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: 'Failed to create invoice link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ invoiceLink: data.result });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}