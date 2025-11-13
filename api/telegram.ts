// Этот код будет выполняться на сервере, а не в браузере пользователя.
// У него есть безопасный доступ к вашим секретным ключам.

// Определяем, как выглядят данные, которые приходят от формы
interface RequestBody {
  message: string;
}

// Это основная функция-"почтальон"
export default async function handler(request: Request) {
  // 1. Проверяем, что запрос пришел правильным методом (POST)
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Разрешен только метод POST' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Получаем данные (текст сообщения) из запроса формы
    const { message } = (await request.json()) as RequestBody;

    // 3. Безопасно получаем ваши секретные ключи из переменных окружения на сервере
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 4. Проверяем, что ключи действительно существуют
    if (!botToken || !chatId) {
      console.error('Ошибка: Ключи Telegram не найдены на сервере.');
      return new Response(JSON.stringify({ message: 'Ошибка конфигурации сервера: ключи Telegram отсутствуют.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Формируем URL для отправки сообщения в Telegram API
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // 6. Отправляем сообщение
    const response = await fetch(url, {
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

    // 7. Проверяем ответ от Telegram
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка от Telegram:', errorData);
      return new Response(JSON.stringify({ message: `Ошибка при отправке в Telegram: ${errorData.description}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 8. Если все успешно, отправляем положительный ответ обратно форме
    return new Response(JSON.stringify({ message: 'Сообщение успешно отправлено' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Внутренняя ошибка сервера:', error);
    return new Response(JSON.stringify({ message: 'Произошла внутренняя ошибка сервера.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
