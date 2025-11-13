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
      <div>
        <label htmlFor="region" className="block text-lg font-semibold text-slate-700 mb-2">Регион монтажа</label>
        <div className="relative">
          <select
            id="region"
            value={config.region}
            onChange={(e) => onConfigChange('region', e.target.value as Region)}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
          >
            {REGIONS_CONFIG.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="hasInstallation" className="flex items-start p-4 border rounded-lg cursor-pointer transition-all bg-white hover:bg-slate-50">
          <div className="flex items-center h-5">
            <input
              id="hasInstallation"
              type="checkbox"
              checked={config.hasInstallation}
              onChange={(e) => onConfigChange('hasInstallation', e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${config.hasInstallation ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-400'}`}>
              {config.hasInstallation && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="ml-4">
            <span className="font-medium text-slate-800">Включить монтаж в расчет</span>
            <p className="text-sm text-slate-500">Профессиональная установка и настройка оборудования на вашем объекте.</p>
          </div>
        </label>
      </div>
    </div>
  );
};
