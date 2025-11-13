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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="width" className="block text-lg font-semibold text-slate-700 mb-2">Ширина (B), мм</label>
          <input
            id="width"
            type="number"
            value={config.width}
            onChange={(e) => onConfigChange('width', parseInt(e.target.value, 10) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition ${errors.width ? 'border-red-500 focus:ring-red-300 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder="Например, 2000"
            aria-invalid={!!errors.width}
            aria-describedby={errors.width ? "width-error" : undefined}
          />
          {errors.width && <p id="width-error" className="mt-2 text-sm text-red-600">{errors.width}</p>}
        </div>
        <div>
          <label htmlFor="height" className="block text-lg font-semibold text-slate-700 mb-2">Высота (H), мм</label>
          <input
            id="height"
            type="number"
            value={config.height}
            onChange={(e) => onConfigChange('height', parseInt(e.target.value, 10) || 0)}
            className={`w-full p-3 border rounded-lg focus:ring-2 transition ${errors.height ? 'border-red-500 focus:ring-red-300 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder="Например, 2200"
            aria-invalid={!!errors.height}
            aria-describedby={errors.height ? "height-error" : undefined}
          />
          {errors.height && <p id="height-error" className="mt-2 text-sm text-red-600">{errors.height}</p>}
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-r-lg">
        <p className="text-sm">Площадь проема: <span className="font-bold">{((config.width / 1000) * (config.height / 1000)).toFixed(2)} м²</span></p>
      </div>
    </div>
  );
};
