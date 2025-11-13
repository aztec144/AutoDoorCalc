import React from 'react';
import { Configuration } from '../types';

interface OptionsStepProps {
  config: Configuration;
  onConfigChange: <K extends keyof Configuration>(key: K, value: Configuration[K]) => void;
}

const CheckboxOption: React.FC<{
  id: keyof Configuration;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (id: keyof Configuration, checked: boolean) => void;
}> = ({ id, label, description, checked, disabled, onChange }) => (
  <label htmlFor={id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'hover:border-blue-300'}`}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(id, e.target.checked)}
      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
    />
    <div className="ml-4">
      <span className="font-medium text-slate-800">{label}</span>
      <p className="text-sm text-slate-500">{description}</p>
      {disabled && <p className="text-xs text-red-500 mt-1">Недоступно для выбранного типа двери.</p>}
    </div>
  </label>
);

export const OptionsStep: React.FC<OptionsStepProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-700">Дополнительные опции</h3>
      <p className="text-slate-500">Все опции включены по умолчанию для вашего удобства.</p>
      
      <div className="space-y-3">
        <CheckboxOption
          id="hasBattery"
          label="АКБ (Аккумулятор)"
          description="Обеспечивает работу двери при отключении электроэнергии."
          checked={config.hasBattery}
          onChange={onConfigChange}
        />
        <CheckboxOption
          id="hasLock"
          label="Электро-магнитный замок"
          description="Надежно запирает створки в закрытом положении."
          checked={config.hasLock}
          onChange={onConfigChange}
        />
        <CheckboxOption
          id="hasFilling"
          label="Заполнение (Стеклопакет)"
          description="Установка закаленного стеклопакета в створки."
          checked={config.hasFilling}
          onChange={onConfigChange}
        />
        <CheckboxOption
          id="hasPainting"
          label="Покраска по RAL"
          description="Окрашивание профиля в любой цвет по каталогу RAL."
          checked={config.hasPainting}
          onChange={onConfigChange}
        />
      </div>
    </div>
  );
};
