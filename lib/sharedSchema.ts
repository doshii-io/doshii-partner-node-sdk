export interface Surcount {
  posId: string;
  name: string;
  description: string;
  amount: number;
  type: "absolute" | "percentage";
  value: string;
}

export interface Consumer {
  name: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    notes: string;
  };
}

export interface LogsResponse {
  logId: string;
  employeeId: string;
  employeeName: string;
  employeePosRef: string;
  deviceRef: string;
  deviceName: string;
  area: string;
  appId: string;
  appName: string;
  audit: string;
  action: Array<string>;
  performedAt: string;
}

export type LocationClasses =
  | "Accommodation"
  | "Amateur Sport"
  | "Bakery"
  | "Bar"
  | "Café"
  | "Cinema"
  | "Club"
  | "Education"
  | "Golf Club"
  | "Gym"
  | "Pub"
  | "QSR"
  | "Restaurant"
  | "Takeaway Food"
  | "Test";

export interface ProductOptions {
  posId: string;
  name: string;
  variants: [
    {
      posId: string;
      name: string;
      price: string;
    }
  ];
}

export interface Product {
  rewardRef: string;
  uuid: string;
  posId: string;
  name: string;
  quantity: number;
  description: string;
  unitPrice: string;
  totalBeforeSurcounts: string;
  totalAfterSurcounts: string;
  tags: Array<string>;
  type: "bundle" | "single";
  includedItems: [
    {
      name: string;
      posId: string;
      quantity: number;
      unitPrice: string;
      options: Array<ProductOptions>;
    }
  ];
  surcounts: [
    {
      posId: "123";
      name: "Item name";
      description: "Item description";
      amount: 1000;
      type: "absolute";
      value: "1000";
    }
  ];
  options: Array<ProductOptions>;
}
