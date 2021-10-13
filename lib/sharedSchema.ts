export interface Surcount {
  posId?: string;
  name: string;
  description?: string;
  amount: number;
  type: "absolute" | "percentage";
  value: number;
  rewardRef?: string;
}

export interface Consumer {
  name: string;
  email?: string;
  phone: string;
  marketingOptIn?: boolean;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
}

export interface LogsRequest {
  employeeName: string;
  employeePosRef: string;
  deviceRef: string;
  deviceName: string;
  area: string;
}

export enum LocationClasses {
  ACCOMODATION = "Accomodation",
  AMATEUR_SPORT = "Amateur Sport",
  BAKERY = "Bakery",
  BAR = "Bar",
  CAFE = "Café",
  CINEMA = "Cinema",
  CLUB = "Club",
  EDUCATION = "Education",
  GOLF_CLUB = "Golf Club",
  GYM = "Gym",
  PUB = "Pub",
  QSR = "QSR",
  RESTAURANT = "Restaurant",
  TAKEAWAY_FOOD = "Takeaway Food",
  TEST = "Test",
}
export interface ProductOptions {
  posId?: string;
  name: string;
  variants: Array<ProductOptionsVariant>
  min: string
  max: string
}

export interface ProductOptionsVariant {
  posId?: string;
  name: string;
  price: number;
}
export interface ProductIncludedItem {
  name: string;
  posId?: string;
  quantity: number;
  unitPrice: string;
  options: Array<ProductOptions>;
}
export interface Product {
  rewardRef?: string;
  uuid?: string;
  posId?: string;
  name: string;
  quantity: number;
  description?: string;
  unitPrice: string;
  totalBeforeSurcounts: string;
  totalAfterSurcounts: string;
  tags?: Array<string>;
  type: "bundle" | "single";
  includedItems?: Array<ProductIncludedItem>;
  surcounts: Array<Surcount>;
  options: Array<ProductOptions>;
}
