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
