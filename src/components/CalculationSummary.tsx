import React, { useState } from 'react';
import { Prices, Configuration, LeadForm, Region } from '../types';

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

const DetailRow: React.FC<{ label: React.ReactNode; value: string | number | React.ReactNode; isTotal?: boolean }> = ({ label, value, isTotal }) => (
  <div className={`flex justify-between items-center py-3 ${isTotal ? 'border-t border-white/10 mt-2 pt-4' : 'border-b border-white/5 last:border-0'}`}>
    <div className={`text-sm ${isTotal ? 'text-white font-bold text-lg' : 'text-slate-400'}`}>{label}</div>
    <span className={`text-right ${isTotal ? 'text-2xl font-bold text-white' : 'text-slate-200 font-medium'}`}>{value}</span>
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
${config.region !== Region.Kazan ? '- ⚠️ Транспортные расходы не учтены' : ''}

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
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData.message || 'Ошибка сервера');
        setSubmissionStatus('error');
      }
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Ошибка сети');
      setSubmissionStatus('error');
    }
  };

  return (
    <div className="h-full flex flex-col custom-scrollbar overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Смета проекта</h2>
      <p className="text-indigo-300 text-sm mb-6 opacity-80">Предварительный расчет стоимости</p>
      
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm mb-4">
        <div className="flex items-center justify-between mb-4">
           <div>
              <div className="text-white font-semibold">{config.doorType}</div>
              <div className="text-slate-400 text-xs mt-1">{config.manufacturer} • {config.width}x{config.height}мм</div>
           </div>
           <div className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold">
              {config.quantity} шт
           </div>
        </div>
        
        <div className="space-y-1">
            <DetailRow label="Цена за ед." value={formatCurrency(prices.itemPrice)} />
            {config.hasInstallation && <DetailRow label={`Монтаж (${config.region})`} value="Включен" />}
        </div>

        {/* Предупреждение о транспортных расходах */}
        {config.region !== Region.Kazan && (
           <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-amber-400/90 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Транспортные расходы не учтены
              </p>
           </div>
        )}

        <DetailRow label="Итого" value={formatCurrency(prices.totalPrice)} isTotal />
      </div>

      {/* Дисклеймер о предварительном расчете */}
      <p className="text-slate-500 text-xs text-center mb-8 leading-relaxed px-4">
         Расчет является предварительным и требует уточнения у менеджера.
      </p>

      <div className="mt-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Оформление заявки</h3>
        
        {isFormDisabled ? (
          <div className="p-4 bg-indigo-900/30 border border-indigo-500/30 text-indigo-200 rounded-xl text-sm text-center">
            Заполните все параметры двери, чтобы отправить заявку менеджеру.
          </div>
        ) : submissionStatus === 'success' ? (
          <div className="p-6 bg-green-500/10 border border-green-500/30 text-green-100 rounded-2xl text-center animate__animated animate__fadeIn">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="font-bold text-lg">Заявка принята!</p>
            <p className="text-sm opacity-80 mt-1">Менеджер свяжется с вами в ближайшее время.</p>
            <button onClick={handleNewCalculation} className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
              Рассчитать еще
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 animate__animated animate__fadeIn">
            <div className="space-y-3">
                <input 
                    type="text" name="name" placeholder="Ваше имя" required 
                    value={lead.name} onChange={handleInputChange} 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <input 
                    type="tel" name="phone" placeholder="Телефон" required 
                    value={lead.phone} onChange={handleInputChange} 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <input 
                    type="email" name="email" placeholder="Email" required 
                    value={lead.email} onChange={handleInputChange} 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <textarea 
                    name="comment" 
                    placeholder="Комментарий" 
                    value={lead.comment || ''} 
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
            </div>
            
            {submissionStatus === 'error' && (
                <div className="text-xs text-red-300 bg-red-900/30 p-2 rounded border border-red-900/50">
                    {submissionError || "Ошибка отправки"}
                </div>
            )}

            <button 
              type="submit" 
              disabled={submissionStatus === 'loading'}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait mt-2"
            >
              {submissionStatus === 'loading' ? 'Отправка...' : 'Отправить заявку'}
            </button>
            
            <p className="text-[10px] text-slate-500 text-center mt-2">
                Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};