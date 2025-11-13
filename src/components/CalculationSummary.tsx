import React, { useState } from 'react';
import { Prices, Configuration, LeadForm } from '../types';

interface CalculationSummaryProps {
  prices: Prices;
  config: Configuration;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value);
};

const DetailRow: React.FC<{ label: React.ReactNode; value: string | number | React.ReactNode; isBold?: boolean }> = ({ label, value, isBold }) => (
  <div className={`flex justify-between items-start py-2 ${isBold ? 'font-semibold' : ''}`}>
    <div className="text-sm text-slate-600">{label}</div>
    <span className={`text-sm text-right ${isBold ? 'text-slate-800' : 'text-slate-500'}`}>{value}</span>
  </div>
);

const initialLeadState: LeadForm = { name: '', phone: '', email: '', comment: '' };

export const CalculationSummary: React.FC<CalculationSummaryProps> = ({ prices, config, onReset, currentStep, totalSteps }) => {
  const [lead, setLead] = useState<LeadForm>(initialLeadState);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isFormDisabled = currentStep < totalSteps;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLead(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNewCalculation = () => {
    setLead(initialLeadState);
    setSubmissionStatus('idle');
    setSubmissionError(null);
    onReset();
  };

  const escapeHTML = (text: string | number) => {
    const str = String(text);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  const generateTelegramMessage = () => {
    const details = `<b>Новая заявка с калькулятора</b>
--------------------------------
<b>Контактные данные:</b>
- Имя: ${escapeHTML(lead.name)}
- Телефон: <code>${escapeHTML(lead.phone)}</code>
- Email: ${escapeHTML(lead.email)}${lead.comment ? `\n- Комментарий: ${escapeHTML(lead.comment)}` : ''}

--------------------------------
<b>Детализация расчета:</b>
- Тип двери: ${escapeHTML(config.doorType)}
- Производитель: ${escapeHTML(config.manufacturer)}
- Количество: ${escapeHTML(config.quantity)} шт.
- Ширина: ${escapeHTML(config.width)} мм
- Высота: ${escapeHTML(config.height)} мм
- АКБ: ${config.hasBattery ? 'Да' : 'Нет'}
- Замок: ${config.hasLock ? 'Да' : 'Нет'}
- Заполнение: ${config.hasFilling ? 'Да' : 'Нет'}
- Покраска: ${config.hasPainting ? 'Да' : 'Нет'}
- Регион: ${escapeHTML(config.region)}
- Монтаж: ${config.hasInstallation ? 'Да' : 'Нет'}

--------------------------------
<b>ИТОГИ:</b>
- Цена за 1 изделие: <code>${escapeHTML(formatCurrency(prices.itemPrice))}</code>
- <b>ОБЩИЙ ИТОГ:</b> <b><code>${escapeHTML(formatCurrency(prices.totalPrice))}</code></b>
`;
    return details.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    setSubmissionStatus('loading');

    const message = generateTelegramMessage();

    try {
      // Send data to the secure backend endpoint instead of Telegram directly
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        // Handle errors from our own backend
        const errorData = await response.json();
        const errorMessage = errorData.message || `Ошибка сервера: ${response.statusText}`;
        console.error('Backend error:', errorMessage);
        setSubmissionError(errorMessage);
        setSubmissionStatus('error');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Проверьте сетевое соединение.';
      setSubmissionError(`Ошибка сети: ${errorMessage}`);
      setSubmissionStatus('error');
    }
  };

  const selectedOptions: string[] = [];
  if (config.hasBattery) selectedOptions.push('АКБ');
  if (config.hasLock) selectedOptions.push('Замок');
  if (config.hasFilling) selectedOptions.push('СПО');
  if (config.hasPainting) selectedOptions.push('RAL');

  return (
    <div className="h-full flex flex-col sticky top-0">
      <h2 className="text-2xl font-bold text-slate-800">Ваш расчет</h2>
      <p className="text-md font-semibold text-slate-700 mt-2">{config.doorType} / {config.manufacturer} / Проем: {config.width} х {config.height}</p>
      
      <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
        <DetailRow
          label={
            <>
              Цена за 1 изделие
              {selectedOptions.length > 0 && (
                <div className="text-xs text-slate-400 font-normal mt-1">
                  ({selectedOptions.join(', ')})
                </div>
              )}
            </>
          }
          value={formatCurrency(prices.itemPrice)}
        />
        <DetailRow label={`Количество`} value={`${config.quantity} шт.`} />
        {config.hasInstallation && <DetailRow label={`Монтаж (${config.region})`} value={`Включен`} />}
        <hr className="my-2 border-slate-200" />
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-slate-800">Общий итог:</span>
          <span className="text-2xl font-extrabold text-blue-600">{formatCurrency(prices.totalPrice)}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Расчет является предварительным и требует уточнения у менеджера.</p>
      </div>

      <div className="mt-auto pt-6">
        <h3 className="text-xl font-semibold text-slate-800">Оставить заявку</h3>
        <p className="text-sm text-slate-500 mb-4">Наш менеджер свяжется с вами для уточнения деталей.</p>
        
        {isFormDisabled && (
          <div className="p-3 text-center bg-yellow-50 text-yellow-800 rounded-lg mb-4 border border-yellow-200 animate__animated animate__fadeIn">
            <p className="text-sm font-medium">Для отправки заявки, пожалуйста, пройдите все шаги расчета.</p>
          </div>
        )}
        
        {submissionStatus === 'success' && (
          <div className="p-4 text-center bg-green-100 text-green-800 rounded-lg">
            <p className="font-semibold">Спасибо! Ваша заявка отправлена.</p>
            <p className="text-sm">Мы скоро свяжемся с вами.</p>
            <button 
              onClick={handleNewCalculation}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Новый расчет
            </button>
          </div>
        )}

        {submissionStatus === 'error' && (
          <div className="p-4 text-center bg-red-100 text-red-800 rounded-lg">
            <p className="font-semibold">Ошибка отправки.</p>
            <p className="text-sm mb-3">Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.</p>
            {submissionError && <p className="text-xs bg-red-200 p-2 rounded mt-2 font-mono">{submissionError}</p>}
            <button 
              onClick={() => { setSubmissionStatus('idle'); setSubmissionError(null); }}
              className="px-4 py-1 mt-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {(submissionStatus === 'idle' || submissionStatus === 'loading') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Ваше имя" required value={lead.name} onChange={handleInputChange} disabled={isFormDisabled} className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400 text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed"/>
            <input type="tel" name="phone" placeholder="Телефон" required value={lead.phone} onChange={handleInputChange} disabled={isFormDisabled} className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400 text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed"/>
            <input type="email" name="email" placeholder="Email" required value={lead.email} onChange={handleInputChange} disabled={isFormDisabled} className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400 text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed"/>
            <textarea
              name="comment"
              placeholder="Комментарий к заказу"
              value={lead.comment}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400 text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed"
              rows={3}
            />
            <button 
              type="submit" 
              disabled={submissionStatus === 'loading' || isFormDisabled}
              className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all text-lg flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submissionStatus === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </>
              ) : (
                'Отправить заявку'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
