import { NextRequest, NextResponse } from 'next/server'
import fetch from 'node-fetch'

export async function POST(request: NextRequest) {
  const { user_id, payload } = await request.json()
  const BOT_TOKEN = process.env.BOT_TOKEN

  // Отправляем в бота через Telegram sendMessage с payload
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: user_id,
      text: `✅ Оплата подтверждена! Ваш уникальный ключ получен.`
    })
  })

  return NextResponse.json({ ok: true })
}
