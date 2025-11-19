import React from 'react';
import { Configuration } from '../types';

interface OptionsStepProps {
  config: Configuration;
  onConfigChange: <K extends keyof Configuration>(key: K, value: Configuration[K]) => void;
}

const ToggleOption: React.FC<{
  id: keyof Configuration;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (id: keyof Configuration, checked: boolean) => void;
}> = ({ id, label, description, checked, disabled, onChange }) => (
  <div 
    onClick={() => !disabled && onChange(id, !checked)}
    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer group
    ${checked ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-indigo-200'}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}
  `}>
    <div className="flex-1 pr-4">
        <h4 className={`font-semibold text-base ${checked ? 'text-indigo-900' : 'text-slate-800'}`}>{label}</h4>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
         {disabled && <p className="text-xs text-red-500 mt-1">Недоступно для выбранного типа.</p>}
    </div>
    
    {/* Custom Toggle Switch */}
    <div className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${checked ? 'bg-indigo-600' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

export const OptionsStep: React.FC<OptionsStepProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Комплектация</h3>
        <p className="text-slate-500 mt-1">Выберите дополнительные опции для вашего проекта</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ToggleOption
          id="hasBattery"
          label="Резервное питание (АКБ)"
          description="Автоматическое открытие или закрытие при отключении электричества."
          checked={config.hasBattery}
          onChange={onConfigChange}
        />
        <ToggleOption
          id="hasLock"
          label="Электромагнитный замок"
          description="Блокировка створок в закрытом режиме (режим «Ночь»)."
          checked={config.hasLock}
          onChange={onConfigChange}
        />
        <ToggleOption
          id="hasFilling"
          label="Заполнение (Стеклопакет)"
          description="Установка закаленного стеклопакета в створки."
          checked={config.hasFilling}
          onChange={onConfigChange}
        />
        <ToggleOption
          id="hasPainting"
          label="Покраска профиля (RAL)"
          description="Порошковая покраска алюминиевого профиля в любой цвет."
          checked={config.hasPainting}
          onChange={onConfigChange}
        />
      </div>
    </div>
  );
};