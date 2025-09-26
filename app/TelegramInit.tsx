// app/TelegramInit.tsx
"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function TelegramInit() {
  useEffect(() => {
    const initTelegram = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (!tg) return;

      // Обязательно сообщаем, что WebApp готов
      tg.ready();

      // Разворачиваем на весь экран
      tg.expand();

      // Настраиваем цвета
      tg.setHeaderColor("#151517");
      tg.setBackgroundColor("#151517");

      // Дополнительно можно скрыть кнопку
      tg.MainButton.hide();

      // На iOS иногда помогает повторный вызов expand через setTimeout
      setTimeout(() => tg.expand(), 100);
    };

    if ((window as any).Telegram?.WebApp) {
      initTelegram();
    } else {
      window.addEventListener("TelegramWebAppReady", initTelegram);
    }

    return () => {
      window.removeEventListener("TelegramWebAppReady", initTelegram);
    };
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="beforeInteractive"
    />
  );
}
