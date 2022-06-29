import { AxiosRequestConfig } from "axios";

export enum ReferralStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  COMPLETE = "complete",
  CANCELLED = "cancelled"
}

export interface ReferralRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  venueName?: string;
  partnerLocationId?: string;
  doshiiLocationId?: string;
  doshiiOrganisationId?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  }
}

export interface ReferralResponse {
  requestId: string;
  status: ReferralStatus;
  link: string;
}

/**
 * Referrals API
 */
export default class Referral {
  private readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Create a referral for a sign up from an app
   * @param data Referral data
   * @returns The referral that was created
   */
  async create(data: ReferralRequest): Promise<ReferralResponse> {
    return await this.requestMaker({
      url: "/referrals",
      method: "POST",
      data,
    });
  }
}
