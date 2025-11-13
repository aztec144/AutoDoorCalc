// Этот код будет выполняться на сервере в стандартной среде Node.js.
// Он имеет безопасный доступ к вашим секретным ключам.

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel автоматически парсит тело запроса, если Content-Type: application/json
interface RequestBody {
  message: string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // 1. Проверяем, что запрос пришел правильным методом (POST)
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ message: 'Разрешен только метод POST' });
  }

  try {
    // 2. Получаем данные (текст сообщения) из тела запроса
    const { message } = request.body as RequestBody;

    // 3. Безопасно получаем ваши секретные ключи из переменных окружения на сервере
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 4. Проверяем, что ключи действительно существуют
    if (!botToken || !chatId) {
      console.error('Ошибка: Ключи Telegram не найдены на сервере Vercel.');
      return response.status(500).json({ message: 'Ошибка конфигурации сервера: ключи Telegram отсутствуют.' });
    }

    // 5. Формируем URL для отправки сообщения в Telegram API
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // 6. Отправляем сообщение
    const telegramApiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Включаем поддержку жирного текста, ссылок и т.д.
      }),
    });
    
    const telegramResponseData = await telegramApiResponse.json();

    // 7. Проверяем ответ от Telegram
    if (!telegramApiResponse.ok) {
      console.error('Ошибка от Telegram API:', telegramResponseData);
      return response.status(telegramApiResponse.status).json({
        message: `Ошибка при отправке в Telegram: ${telegramResponseData.description || 'Неизвестная ошибка'}`,
      });
    }

    // 8. Если все успешно, отправляем положительный ответ обратно форме
    return response.status(200).json({ message: 'Сообщение успешно отправлено' });

  } catch (error) {
    console.error('Внутренняя ошибка сервера:', error);
    // Для безопасности не отправляем детали ошибки клиенту
    return response.status(500).json({ message: 'Произошла внутренняя ошибка сервера.' });
  }
}
