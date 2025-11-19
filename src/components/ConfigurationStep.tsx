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
      {/* Door Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 flex items-center">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-2">1</span>
          Тип конструкции
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOOR_TYPES_CONFIG.map(({ group, types }) => (
            <div key={group} className="space-y-3">
               <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">{group}</h4>
               <div className="grid grid-cols-1 gap-3">
                 {types.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onConfigChange('doorType', id)}
                    className={`group relative flex items-center p-4 rounded-2xl border transition-all duration-200 text-left
                      ${config.doorType === id 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-md shadow-indigo-100' 
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                      }`}
                  >
                    <div className={`p-3 rounded-xl mr-4 transition-colors ${config.doorType === id ? 'bg-white text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
                        <DoorIcons type={id} className="w-8 h-8" />
                    </div>
                    <div>
                        <span className={`block font-semibold text-sm transition-colors ${config.doorType === id ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-900'}`}>{label}</span>
                    </div>
                    {config.doorType === id && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        </div>
                    )}
                  </button>
                 ))}
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Manufacturer Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-2">2</span>
              Производитель
            </h3>
            <div className="flex gap-3">
              {MANUFACTURER_CONFIG.map(({ id, label }) => (
                 <button
                  key={id}
                  onClick={() => onConfigChange('manufacturer', id as Manufacturer)}
                  className={`flex-1 p-4 rounded-2xl border transition-all duration-200 text-center relative
                    ${config.manufacturer === id 
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 text-indigo-900 font-bold shadow-sm' 
                      : 'border-slate-200 bg-white text-slate-600 font-medium hover:border-indigo-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-2">3</span>
              Количество
            </h3>
            <div className="relative">
                <input
                id="quantity"
                type="number"
                min="1"
                value={config.quantity || ''}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onConfigChange('quantity', parseInt(e.target.value, 10) || 1)}
                className="w-full p-4 pl-4 border border-slate-200 rounded-2xl bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
                />
                 <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium pointer-events-none">шт.</span>
            </div>
          </div>
      </div>
    </div>
  );
};