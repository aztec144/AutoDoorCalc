import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

// Вспомогательная функция для чтения тела запроса в Node.js
async function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // Если тело пустое, возвращаем пустой объект
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из .env.local
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      // Пользовательский плагин для обработки /api/telegram в режиме разработки
      {
        name: 'local-telegram-api',
        configureServer(server) {
          server.middlewares.use('/api/telegram', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Method Not Allowed' }));
              return;
            }

            try {
              const { message } = await getRequestBody(req);
              const botToken = env.TELEGRAM_BOT_TOKEN;
              const chatId = env.TELEGRAM_CHAT_ID;

              if (!botToken || !chatId) {
                console.error('ОШИБКА: Ключи Telegram (TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID) не найдены в файле .env.local');
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Ошибка конфигурации сервера: Ключи Telegram отсутствуют.' }));
                return;
              }

              const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

              const telegramResponse = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: message,
                  parse_mode: 'HTML',
                }),
              });

              const responseData = await telegramResponse.json();

              if (!telegramResponse.ok) {
                console.error('Ошибка от API Telegram:', responseData);
                res.statusCode = telegramResponse.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: `Ошибка при отправке в Telegram: ${responseData.description}` }));
                return;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Сообщение успешно отправлено' }));

            } catch (error) {
              console.error('Внутренняя ошибка dev-сервера при обработке /api/telegram:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Произошла внутренняя ошибка сервера.' }));
            }
          });
        },
      },
    ],
  };
});
