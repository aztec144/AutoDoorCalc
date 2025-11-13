
export enum DoorType {
  SlidingSingleLeaf = 'Раздвижная одностворчатая',
  SlidingDoubleLeaf = 'Раздвижная двухстворчатая',
  TelescopicOneWay = 'Телескопическая односторонняя',
  TelescopicTwoWay = 'Телескопическая двухсторонняя',
}

export enum Manufacturer {
  GEZE = 'GEZE',
  DoorHan = 'DoorHan',
}

export enum Region {
  Kazan = 'Казань',
  Chelny = 'Н. Челны',
  YoshkarOla = 'Йошкар-Ола',
  Cheboksary = 'Чебоксары',
}

export interface Configuration {
  doorType: DoorType;
  manufacturer: Manufacturer;
  quantity: number;
  width: number;
  height: number;
  hasBattery: boolean;
  hasLock: boolean;
  hasFilling: boolean;
  hasPainting: boolean;
  region: Region;
  hasInstallation: boolean;
}

export interface Prices {
  itemPrice: number;
  totalPrice: number;
}

export interface LeadForm {
  name: string;
  phone: string;
  email: string;
  comment?: string;
}
