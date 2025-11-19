import React from 'react';
import { Configuration, Region } from '../types';
import { REGIONS_CONFIG } from '../constants';

interface InstallationStepProps {
  config: Configuration;
  onConfigChange: <K extends keyof Configuration>(key: K, value: Configuration[K]) => void;
}

export const InstallationStep: React.FC<InstallationStepProps> = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-8">
      
      <div className="bg-white rounded-2xl p-1">
        <label htmlFor="region" className="block text-sm font-bold text-slate-900 mb-3 ml-1">Регион объекта</label>
        <div className="relative">
          <select
            id="region"
            value={config.region}
            onChange={(e) => onConfigChange('region', e.target.value as Region)}
            className="w-full p-4 pr-10 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition appearance-none outline-none cursor-pointer hover:border-indigo-300"
          >
            {REGIONS_CONFIG.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        
        {config.region !== Region.Kazan && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl animate__animated animate__fadeIn flex items-start">
            <svg className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
                <span className="font-bold block mb-1">Обратите внимание</span>
                Транспортные расходы рассчитываются индивидуально и не включены в смету.
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3 ml-1 leading-relaxed">
          Если не нашли Ваш регион, то укажите ближайший, а в поле комментарий укажите Город, где необходим монтаж.
        </p>
      </div>
      
      <div 
        onClick={() => onConfigChange('hasInstallation', !config.hasInstallation)}
        className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer group
            ${config.hasInstallation 
                ? 'border-indigo-600 bg-indigo-50/30' 
                : 'border-slate-200 bg-white hover:border-indigo-200'
            }`}
      >
          <div className="flex-1 pr-4">
              <h4 className={`font-semibold text-base ${config.hasInstallation ? 'text-indigo-900' : 'text-slate-800'}`}>Включить монтаж</h4>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Профессиональная установка и настройка оборудования на вашем объекте.
              </p>
          </div>
          
          {/* Custom Toggle Switch */}
          <div className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out flex-shrink-0 ${config.hasInstallation ? 'bg-indigo-600' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
              <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${config.hasInstallation ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
      </div>
    </div>
  );
};