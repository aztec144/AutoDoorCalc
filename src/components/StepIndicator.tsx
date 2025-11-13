import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const CheckmarkIcon: React.FC = () => (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
    </svg>
);

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = ['Конфигурация', 'Размеры', 'Опции', 'Монтаж'];

  return (
    <div className="flex items-center w-full">
      {steps.map((title, index) => {
        const stepNumber = index + 1;
        const isAchieved = currentStep >= stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <React.Fragment key={title}>
            <div className="flex flex-col items-center text-center w-1/4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative
                  ${isAchieved ? 'bg-green-500' : 'bg-white border-2 border-slate-300'}
                  ${isActive ? 'ring-4 ring-blue-200' : ''}
                `}
              >
                {isAchieved && <CheckmarkIcon />}
              </div>
              <span className={`mt-2 text-xs md:text-sm font-medium
                ${isActive ? 'text-blue-600' : 'text-slate-500'}
              `}>
                {title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5
                ${isAchieved ? 'bg-green-500' : 'bg-slate-300'}
              `}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
