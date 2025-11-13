
import React from 'react';
import { Configuration, Manufacturer } from '../types';
import { DOOR_TYPES_CONFIG, MANUFACTURER_CONFIG } from '../constants';
import { DoorIcons } from './icons/DoorIcons';

interface ConfigurationStepProps {
  config: Configuration;
  onConfigChange: <K extends keyof Configuration>(key: K, value: Configuration[K]) => void;
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">1. Тип двери</h3>
        <div className="space-y-6">
          {DOOR_TYPES_CONFIG.map(({ group, types }) => (
            <div key={group}>
              <h4 className="text-md font-medium text-slate-600 mb-3">{group}</h4>
              <div className="grid grid-cols-2 gap-4">
                {types.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onConfigChange('doorType', id)}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-200 flex flex-col items-center justify-center space-y-2
                      ${config.doorType === id 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md' 
                        : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <DoorIcons type={id} className="w-10 h-10 text-slate-600" />
                    <span className="font-medium text-sm text-slate-800">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">2. Производитель привода</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {MANUFACTURER_CONFIG.map(({ id, label }) => (
             <button
              key={id}
              onClick={() => onConfigChange('manufacturer', id as Manufacturer)}
              className={`flex-1 p-4 border-2 rounded-lg text-center transition-all duration-200
                ${config.manufacturer === id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md' 
                  : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                }`}
            >
              <span className="font-bold text-lg text-slate-800">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-lg font-semibold text-slate-700 mb-2">3. Количество дверей</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={config.quantity}
          onChange={(e) => onConfigChange('quantity', parseInt(e.target.value, 10) || 1)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          aria-describedby="quantity-helper"
        />
        <p id="quantity-helper" className="mt-2 text-sm text-slate-500">
          Укажите количество комплектов. Значение должно быть целым положительным числом.
        </p>
      </div>
    </div>
  );
};