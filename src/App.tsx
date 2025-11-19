import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DoorType, Manufacturer, Region, Configuration, Prices } from './types';
import { BASE_PRICES, BATTERY_PRICES, LOCK_PRICES, FILLING_PRICE_PER_SQ_METER, PAINTING_PRICE, MARKUP_PRICE, INSTALLATION_PRICES, DIMENSION_LIMITS } from './constants';

import { StepIndicator } from './components/StepIndicator';
import { ConfigurationStep } from './components/ConfigurationStep';
import { DimensionsStep } from './components/DimensionsStep';
import { OptionsStep } from './components/OptionsStep';
import { InstallationStep } from './components/InstallationStep';
import { CalculationSummary } from './components/CalculationSummary';

const TOTAL_STEPS = 4;

const initialConfiguration: Configuration = {
  doorType: DoorType.SlidingDoubleLeaf,
  manufacturer: Manufacturer.GEZE,
  quantity: 1,
  width: 2000,
  height: 2200,
  hasBattery: true,
  hasLock: true,
  hasFilling: true,
  hasPainting: true,
  region: Region.Kazan,
  hasInstallation: true,
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [configuration, setConfiguration] = useState<Configuration>(initialConfiguration);
  const [prices, setPrices] = useState<Prices>({ itemPrice: 0, totalPrice: 0 });
  const [animationClass, setAnimationClass] = useState('animate__fadeIn');
  const [errors, setErrors] = useState<{ width?: string; height?: string }>({});
  const mainRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isSummaryVisibleOnMobile, setIsSummaryVisibleOnMobile] = useState(false);

  const scrollToTopIfNeeded = () => {
    if (window.innerWidth < 1024 && mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setAnimationClass('animate__fadeOut');
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimationClass('animate__fadeIn');
        scrollToTopIfNeeded();
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setAnimationClass('animate__fadeOut');
      setTimeout(() => {
        if (currentStep === TOTAL_STEPS) {
          setIsSummaryVisibleOnMobile(false);
        }
        setCurrentStep(prev => prev - 1);
        setAnimationClass('animate__fadeIn');
        scrollToTopIfNeeded();
      }, 300);
    }
  };

  const handleReset = () => {
    setAnimationClass('animate__fadeOut');
    setTimeout(() => {
      setCurrentStep(1);
      setConfiguration(initialConfiguration);
      setIsSummaryVisibleOnMobile(false);
      setAnimationClass('animate__fadeIn');
      scrollToTopIfNeeded();
    }, 300);
  };
  
  const showSummaryOnMobile = () => {
    setIsSummaryVisibleOnMobile(true);
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleConfigChange = <K extends keyof Configuration>(key: K, value: Configuration[K]) => {
    setConfiguration(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrices = useCallback(() => {
    const {
      doorType, manufacturer, quantity, width, height,
      hasBattery, hasLock, hasFilling, hasPainting,
      region, hasInstallation
    } = configuration;

    // P_База
    const priceData = BASE_PRICES[doorType][manufacturer];
    let basePrice: number;
    
    // Проверяем, является ли дверь двухстворчатой, есть ли для нее цена large и превышает ли ширина порог
    if (doorType === DoorType.SlidingDoubleLeaf && priceData.large && width > 1500) {
      basePrice = priceData.large;
    } else {
      basePrice = priceData.base;
    }

    // P_АКБ
    const batteryPrice = hasBattery ? BATTERY_PRICES[manufacturer] : 0;

    // P_Замок
    const lockPrice = hasLock ? LOCK_PRICES[doorType][manufacturer] : 0;
    
    // P_Заполнение
    let fillingPrice = 0;
    if (hasFilling && width > 0 && height > 0) {
      const openingAreaM2 = (width / 1000) * (height / 1000);
      const fillingAreaM2 = openingAreaM2 * 0.95;
      fillingPrice = fillingAreaM2 * FILLING_PRICE_PER_SQ_METER;
    }

    // P_Покраска
    const paintingPrice = hasPainting ? PAINTING_PRICE : 0;

    // P_Наценка
    const markupPrice = MARKUP_PRICE;

    // Цена за 1 изделие (P_item)
    const itemPrice = basePrice + batteryPrice + lockPrice + fillingPrice + paintingPrice + markupPrice;

    // P_Монтаж
    const installationPrice = hasInstallation ? INSTALLATION_PRICES[region][doorType] : 0;
    
    // Общий итог
    const totalPrice = (itemPrice * quantity) + (installationPrice * quantity);

    setPrices({ itemPrice, totalPrice });
  }, [configuration]);

  const validateDimensions = useCallback((config: Configuration) => {
    const newErrors: { width?: string; height?: string } = {};
    const { manufacturer, doorType, width, height } = config;

    const heightLimits = DIMENSION_LIMITS.height[manufacturer];
    if (height < heightLimits.min || height > heightLimits.max) {
      newErrors.height = `Высота: от ${heightLimits.min} до ${heightLimits.max} мм.`;
    }

    const widthLimits = DIMENSION_LIMITS.width[doorType];
    if (width < widthLimits.min || width > widthLimits.max) {
      newErrors.width = `Ширина: от ${widthLimits.min} до ${widthLimits.max} мм.`;
    }

    setErrors(newErrors);
  }, []);

  useEffect(() => {
    calculatePrices();
    if (currentStep === 2) {
      validateDimensions(configuration);
    } else {
      setErrors({});
    }
  }, [calculatePrices, configuration, currentStep, validateDimensions]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ConfigurationStep config={configuration} onConfigChange={handleConfigChange} />;
      case 2:
        return <DimensionsStep config={configuration} onConfigChange={handleConfigChange} errors={errors} />;
      case 3:
        return <OptionsStep config={configuration} onConfigChange={handleConfigChange} />;
      case 4:
        return <InstallationStep config={configuration} onConfigChange={handleConfigChange} />;
      default:
        return null;
    }
  };
  
  const isNextDisabled = currentStep === 2 && Object.keys(errors).length > 0;
  const isSummaryHiddenOnMobile = currentStep < TOTAL_STEPS || !isSummaryVisibleOnMobile;

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4 md:p-6 bg-gray-50">
      <main ref={mainRef} className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-8 p-6 md:p-10 flex flex-col relative">
          <header className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Калькулятор стоимости</h1>
            <p className="text-slate-500 mt-2 text-lg">Рассчитайте предварительную стоимость автоматических дверей за 4 шага</p>
          </header>
          
          <div className="mb-10">
            <StepIndicator currentStep={currentStep} />
          </div>
          
          <div className={`flex-grow animate__animated ${animationClass}`}>
            {renderStep()}
          </div>
          
          <div className="mt-12 flex justify-between items-center pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="px-8 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Назад
              </button>
            ) : (
              <div /> 
            )}

            <div className="flex space-x-4">
                {currentStep === TOTAL_STEPS && !isSummaryVisibleOnMobile && (
                  <button
                    onClick={showSummaryOnMobile}
                    className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-700 transition-colors lg:hidden"
                  >
                    Итог
                  </button>
                )}
                
                {currentStep < TOTAL_STEPS && (
                <button
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-500 hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center"
                >
                    Далее
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
                )}
            </div>
          </div>
        </div>
        
        {/* Right Side: Summary (Dark Mode) */}
        <div ref={summaryRef} className={`lg:col-span-4 bg-slate-900 p-6 md:p-10 text-white flex flex-col ${isSummaryHiddenOnMobile ? 'hidden' : ''} lg:flex transition-all duration-500`}>
          <CalculationSummary 
            prices={prices} 
            config={configuration} 
            onReset={handleReset} 
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        </div>
      </main>
    </div>
  );
};

export default App;