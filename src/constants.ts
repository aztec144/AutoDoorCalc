import { DoorType, Manufacturer, Region } from './types';

// ===================================
// УПРАВЛЕНИЕ ЦЕНАМИ (ИМИТАЦИЯ АДМИН-ПАНЕЛИ)
// ===================================

// 1. Базовые цены (Тип двери x Производитель)
export const BASE_PRICES: Record<DoorType, Record<Manufacturer, number>> = {
  [DoorType.SlidingSingleLeaf]: { [Manufacturer.GEZE]: 210000, [Manufacturer.DoorHan]: 150000 },
  [DoorType.SlidingDoubleLeaf]: { [Manufacturer.GEZE]: 240000, [Manufacturer.DoorHan]: 170000 },
  [DoorType.TelescopicOneWay]: { [Manufacturer.GEZE]: 300000, [Manufacturer.DoorHan]: 200000 },
  [DoorType.TelescopicTwoWay]: { [Manufacturer.GEZE]: 350000, [Manufacturer.DoorHan]: 250000 },
};

// 2. Цены на опции
export const BATTERY_PRICES: Record<Manufacturer, number> = {
  [Manufacturer.GEZE]: 7000,
  [Manufacturer.DoorHan]: 6500,
};

// Замки доступны для всех типов дверей
export const LOCK_PRICES: Record<DoorType, Record<Manufacturer, number>> = {
  [DoorType.SlidingSingleLeaf]: { [Manufacturer.GEZE]: 9900, [Manufacturer.DoorHan]: 5500 },
  [DoorType.SlidingDoubleLeaf]: { [Manufacturer.GEZE]: 9900, [Manufacturer.DoorHan]: 5500 },
  [DoorType.TelescopicOneWimport { DoorType, Manufacturer, Region } from './types';

// ===================================
// УПРАВЛЕНИЕ ЦЕНАМИ (ИМИТАЦИЯ АДМИН-ПАНЕЛИ)
// ===================================

type PriceStructure = number | { base: number; large: number };

// 1. Базовые цены (Тип двери x Производитель)
export const BASE_PRICES: Record<DoorType, Record<Manufacturer, PriceStructure>> = {
  [DoorType.SlidingSingleLeaf]: { [Manufacturer.GEZE]: 222162, [Manufacturer.DoorHan]: 157300 },
  [DoorType.SlidingDoubleLeaf]: { 
    [Manufacturer.GEZE]: { base: 231366, large: 248183 },
    [Manufacturer.DoorHan]: { base: 148535, large: 184820 }
  },
  [DoorType.TelescopicOneWay]: { [Manufacturer.GEZE]: 300000, [Manufacturer.DoorHan]: 200000 },
  [DoorType.TelescopicTwoWay]: { [Manufacturer.GEZE]: 350000, [Manufacturer.DoorHan]: 250000 },
};

// 2. Цены на опции
export const BATTERY_PRICES: Record<Manufacturer, number> = {
  [Manufacturer.GEZE]: 6762,
  [Manufacturer.DoorHan]: 6300,
};

// Замки доступны для всех типов дверей
export const LOCK_PRICES: Record<DoorType, Record<Manufacturer, number>> = {
  [DoorType.SlidingSingleLeaf]: { [Manufacturer.GEZE]: 10192, [Manufacturer.DoorHan]: 5180 },
  [DoorType.SlidingDoubleLeaf]: { [Manufacturer.GEZE]: 10192, [Manufacturer.DoorHan]: 5180 },
  [DoorType.TelescopicOneWay]: { [Manufacturer.GEZE]: 14700, [Manufacturer.DoorHan]: 9600 },
  [DoorType.TelescopicTwoWay]: { [Manufacturer.GEZE]: 14700, [Manufacturer.DoorHan]: 9600 },
};

// 3. Фиксированные цены
export const FILLING_PRICE_PER_SQ_METER = 6500; // Цена за 1 м² закаленного стеклопакета
export const PAINTING_PRICE = 7000; // Фиксированная цена за покраску по RAL
export const MARKUP_PRICE = 10000; // Фиксированная наценка на 1 изделие

// 4. Стоимость монтажа (Регион x Тип двери)
export const INSTALLATION_PRICES: Record<Region, Record<DoorType, number>> = {
  [Region.Kazan]: {
    [DoorType.SlidingSingleLeaf]: 20000,
    [DoorType.SlidingDoubleLeaf]: 25000,
    [DoorType.TelescopicOneWay]: 40000,
    [DoorType.TelescopicTwoWay]: 50000,
  },
  [Region.Chelny]: {
    [DoorType.SlidingSingleLeaf]: 25000,
    [DoorType.SlidingDoubleLeaf]: 30000,
    [DoorType.TelescopicOneWay]: 50000,
    [DoorType.TelescopicTwoWay]: 60000,
  },
  [Region.YoshkarOla]: {
    [DoorType.SlidingSingleLeaf]: 25000,
    [DoorType.SlidingDoubleLeaf]: 30000,
    [DoorType.TelescopicOneWay]: 50000,
    [DoorType.TelescopicTwoWay]: 60000,
  },
  [Region.Cheboksary]: {
    [DoorType.SlidingSingleLeaf]: 25000,
    [DoorType.SlidingDoubleLeaf]: 30000,
    [DoorType.TelescopicOneWay]: 50000,
    [DoorType.TelescopicTwoWay]: 60000,
  },
};

// ===================================
// ОГРАНИЧЕНИЯ РАЗМЕРОВ
// ===================================
export const DIMENSION_LIMITS = {
  height: {
    [Manufacturer.GEZE]: { min: 1700, max: 2500 },
    [Manufacturer.DoorHan]: { min: 1700, max: 3000 },
  },
  width: {
    [DoorType.SlidingDoubleLeaf]: { min: 1000, max: 3000 },
    [DoorType.SlidingSingleLeaf]: { min: 700, max: 2000 },
    [DoorType.TelescopicTwoWay]: { min: 2300, max: 3000 },
    [DoorType.TelescopicOneWay]: { min: 1200, max: 2500 },
  },
};

// ===================================
// КОНФИГУРАЦИЯ ИНТЕРФЕЙСА
// ===================================

export const DOOR_TYPES_CONFIG = [
  { 
    group: 'Раздвижные двери',
    types: [
      { id: DoorType.SlidingDoubleLeaf, label: 'Двухстворчатая' },
      { id: DoorType.SlidingSingleLeaf, label: 'Одностворчатая' },
    ]
  },
  {
    group: 'Телескопические двери',
    types: [
      { id: DoorType.TelescopicTwoWay, label: 'Двухсторонняя' },
      { id: DoorType.TelescopicOneWay, label: 'Односторонняя' },
    ]
  }
];

export const MANUFACTURER_CONFIG = [
    { id: Manufacturer.GEZE, label: 'GEZE', logo: 'https://via.placeholder.com/100x40.png?text=GEZE' },
    { id: Manufacturer.DoorHan, label: 'DoorHan', logo: 'https://via.placeholder.com/100x40.png?text=DoorHan' },
];

export const REGIONS_CONFIG = [
  { id: Region.Kazan, label: 'Казань' },
  { id: Region.Chelny, label: 'Н. Челны' },
  { id: Region.YoshkarOla, label: 'Йошкар-Ола' },
  { id: Region.Cheboksary, label: 'Чебоксары' },
];ay]: { [Manufacturer.GEZE]: 14700, [Manufacturer.DoorHan]: 9600 },
  [DoorType.TelescopicTwoWay]: { [Manufacturer.GEZE]: 14700, [Manufacturer.DoorHan]: 9600 },
};

// 3. Фиксированные цены
export const FILLING_PRICE_PER_SQ_METER = 6500; // Цена за 1 м² закаленного стеклопакета
export const PAINTING_PRICE = 7000; // Фиксированная цена за покраску по RAL
export const MARKUP_PRICE = 10000; // Фиксированная наценка на 1 изделие

// 4. Стоимость монтажа (Регион x Тип двери)
export const INSTALLATION_PRICES: Record<Region, Record<DoorType, number>> = {
  [Region.Kazan]: {
    [DoorType.SlidingSingleLeaf]: 20000,
    [DoorType.SlidingDoubleLeaf]: 25000,
    [DoorType.TelescopicOneWay]: 40000,
    [DoorType.TelescopicTwoWay]: 50000,
  },
  [Region.Chelny]: {
    [DoorType.SlidingSingleLeaf]: 25000,
    [DoorType.SlidingDoubleLeaf]: 30000,
    [DoorType.TelescopicOneWay]: 50000,
    [DoorType.TelescopicTwoWay]: 60000,
  },
  [Region.YoshkarOla]: {
    [DoorType.SlidingSingleLeaf]: 25000,
    [DoorType.SlidingDoubleLeaf]: 30000,
    [DoorType.TelescopicOneWay]: 50000,
    [DoorType.TelescopicTwoWay]: 60000,
  },
  [Region.Cheboksary]: {
    [DoorType.SlidingSingleLeaf]: 25000,
    [DoorType.SlidingDoubleLeaf]: 30000,
    [DoorType.TelescopicOneWay]: 50000,
    [DoorType.TelescopicTwoWay]: 60000,
  },
};

// ===================================
// ОГРАНИЧЕНИЯ РАЗМЕРОВ
// ===================================
export const DIMENSION_LIMITS = {
  height: {
    [Manufacturer.GEZE]: { min: 1700, max: 2500 },
    [Manufacturer.DoorHan]: { min: 1700, max: 3000 },
  },
  width: {
    [DoorType.SlidingDoubleLeaf]: { min: 1000, max: 3000 },
    [DoorType.SlidingSingleLeaf]: { min: 700, max: 2000 },
    [DoorType.TelescopicTwoWay]: { min: 2300, max: 3000 },
    [DoorType.TelescopicOneWay]: { min: 1200, max: 2500 },
  },
};

// ===================================
// КОНФИГУРАЦИЯ ИНТЕРФЕЙСА
// ===================================

export const DOOR_TYPES_CONFIG = [
  { 
    group: 'Раздвижные двери',
    types: [
      { id: DoorType.SlidingDoubleLeaf, label: 'Двухстворчатая' },
      { id: DoorType.SlidingSingleLeaf, label: 'Одностворчатая' },
    ]
  },
  {
    group: 'Телескопические двери',
    types: [
      { id: DoorType.TelescopicTwoWay, label: 'Двухсторонняя' },
      { id: DoorType.TelescopicOneWay, label: 'Односторонняя' },
    ]
  }
];

export const MANUFACTURER_CONFIG = [
    { id: Manufacturer.GEZE, label: 'GEZE', logo: 'https://via.placeholder.com/100x40.png?text=GEZE' },
    { id: Manufacturer.DoorHan, label: 'DoorHan', logo: 'https://via.placeholder.com/100x40.png?text=DoorHan' },
];

export const REGIONS_CONFIG = [
  { id: Region.Kazan, label: 'Казань' },
  { id: Region.Chelny, label: 'Н. Челны' },
  { id: Region.YoshkarOla, label: 'Йошкар-Ола' },
  { id: Region.Cheboksary, label: 'Чебоксары' },
];
