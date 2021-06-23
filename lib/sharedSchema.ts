export interface Surcounts {
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
