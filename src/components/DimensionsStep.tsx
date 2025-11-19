import React from 'react';
import { Configuration } from '../types';

interface DimensionsStepProps {
  config: Configuration;
  onConfigChange: <K extends keyof Configuration>(key: K, value: Configuration[K]) => void;
  errors: {
    width?: string;
    height?: string;
  };
}

export const DimensionsStep: React.FC<DimensionsStepProps> = ({ config, onConfigChange, errors }) => {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-900 mb-1">Укажите размеры проема</h3>
        <p className="text-sm text-indigo-700/80 mb-6">Введите размеры чистового светового проема в миллиметрах.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
            <label htmlFor="width" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Ширина (B)</label>
            <div className="relative">
                <input
                    id="width"
                    type="number"
                    value={config.width || ''}
                    onChange={(e) => onConfigChange('width', parseInt(e.target.value, 10) || 0)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full p-4 border rounded-xl outline-none transition-all duration-200 font-medium text-lg
                        ${errors.width 
                            ? 'border-red-300 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm'
                        }`}
                    placeholder="2000"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">мм</span>
            </div>
            {errors.width && <p className="mt-2 text-xs text-red-600 font-medium flex items-center"><span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>{errors.width}</p>}
            </div>

            <div className="relative">
            <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Высота (H)</label>
             <div className="relative">
                <input
                    id="height"
                    type="number"
                    value={config.height || ''}
                    onChange={(e) => onConfigChange('height', parseInt(e.target.value, 10) || 0)}
                    onFocus={(e) => e.target.select()}
                    className={`w-full p-4 border rounded-xl outline-none transition-all duration-200 font-medium text-lg
                        ${errors.height 
                            ? 'border-red-300 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm'
                        }`}
                    placeholder="2200"
                />
                 <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">мм</span>
            </div>
            {errors.height && <p className="mt-2 text-xs text-red-600 font-medium flex items-center"><span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>{errors.height}</p>}
            </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 font-medium">Площадь конструкции</span>
        <span className="text-2xl font-bold text-slate-800">{((config.width / 1000) * (config.height / 1000)).toFixed(2)} <span className="text-base font-normal text-slate-400">м²</span></span>
      </div>
    </div>
  );
};