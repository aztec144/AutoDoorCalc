import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const totalSteps = 4;
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full px-1">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          // Logic for the connecting line (appears before steps 2, 3, 4)
          const isLineVisible = index > 0;
          // The line connects the previous step to this one.
          // It should be filled if the current step is this step or greater.
          const isLineFilled = currentStep >= step;

          const isActive = currentStep === step;
          const isCompleted = currentStep > step;

          return (
            <React.Fragment key={step}>
              {isLineVisible && (
                <div className="flex-1 mx-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out origin-left ${
                      isLineFilled ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}

              <div
                className={`
                  relative flex items-center justify-center flex-shrink-0
                  w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg
                  transition-all duration-500 border-2 select-none z-10
                  ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200 ring-4 ring-indigo-50'
                      : isCompleted
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-400'
                  }
                `}
              >
                {step}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
