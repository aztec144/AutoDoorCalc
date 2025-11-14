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
  const [isLargePriceApplied, setIsLargePriceApplied] = useState(false);
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

    let isLarge = false;

    // P_База
    let basePrice: number;
    const priceData = BASE_PRICES[doorType][manufacturer];
    
    if (doorType === DoorType.SlidingDoubleLeaf && typeof priceData === 'object' && 'base' in priceData) {
        if (width > 1500) {
            basePrice = priceData.large;
            isLarge = true;
        } else {
            basePrice = priceData.base;
        }
    } else {
        basePrice = priceData as number;
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
    setIsLargePriceApplied(isLarge);
  }, [configuration]);

  const validateDimensions = useCallback((config: Configuration) => {
    const newErrors: { width?: string; height?: string } = {};
    const { manufacturer, doorType, width, height } = config;

    const heightLimits = DIMENSION_LIMITS.height[manufacturer];
    if (height < heightLimits.min || height > heightLimits.max) {
      newErrors.height = `Высота для ${manufacturer} должна быть от ${heightLimits.min} до ${heightLimits.max} мм.`;
    }

    const widthLimits = DIMENSION_LIMITS.width[doorType];
    if (width < widthLimits.min || width > widthLimits.max) {
      newErrors.width = `Ширина для "${doorType}" должна быть от ${widthLimits.min} до ${widthLimits.max} мм.`;
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
    <div className="min-h-screen font-sans flex items-center justify-center p-4 bg-slate-100">
      <main ref={mainRef} className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        <div className="p-6 md:p-8 flex flex-col">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Калькулятор стоимости</h1>
            <p className="text-slate-500 mt-2">Рассчитайте предварительную стоимость автоматических дверей</p>
          </header>
          
          <StepIndicator currentStep={currentStep} />
          
          <div className={`flex-grow mt-6 min-h-[24rem] animate__animated ${animationClass}`}>
            {renderStep()}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-300 transition-colors"
              >
                Назад
              </button>
            ) : (
              <div /> // Placeholder to keep "Далее" button on the right
            )}

            {currentStep < TOTAL_STEPS && (
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
              </button>
            )}

            {currentStep === TOTAL_STEPS && !isSummaryVisibleOnMobile && (
              <button
                onClick={showSummaryOnMobile}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors lg:hidden"
              >
                Ваш расчет
              </button>
            )}
          </div>
        </div>
        
        <div ref={summaryRef} className={`bg-slate-100 p-6 md:p-8 ${isSummaryHiddenOnMobile ? 'hidden' : ''} lg:block`}>
          <CalculationSummary 
            prices={prices} 
            config={configuration} 
            onReset={handleReset} 
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            isLargePriceApplied={isLargePriceApplied}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
