import { AxiosRequestConfig } from "axios";
import { Surcount, LogsResponse, Product } from "./sharedSchema";

interface LoyaltyMember {
  ref: string;
  name: string;
  imageUri: string;
}
export interface LoyaltyCheckinResponse {
  id: number;
  locationId: string;
  status: "pending" | "active" | "rejected" | "complete";
  member: LoyaltyMember;
  rewards: {
    items: Array<Product>;
    surcounts: Array<Surcount>;
  };
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
  uri: string;
}

export interface LoyaltyCheckinRequest {
  status?: "active";
  member: LoyaltyMember;
  rewards: {
    items: Array<Product>;
    surcounts: Array<Surcount>;
  };
}

export interface LoyaltyMemberEnquiryRequest {
  members: Array<{
    ref: string;
    name: string;
    email: string;
    phone: string;
  }>;
}

export interface LoyaltyMemberEnquiryResponse {
  id: string;
  locationId: string;
  posTerminalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyMemberActivityRequest {
  status: "accepted" | "rejected";
  rejectionReason: string;
  pointsEarned: number;
  pointsBalance: number;
  message: string;
  rewards: {
    items: Array<Product>;
    surcounts: Array<Surcount>;
  };
}

export interface LoyaltyMemberActivityResponse {
  id: string;
  locationId: string;
  posTerminalId: string;
  status: "pending" | "accepted" | "rejected";
  memberRef: string;
  orderId: string;
  rewards: {
    items: Array<Product>;
    surcounts: Array<Surcount>;
  };
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
  uri: string;
  orderUri: string;
}

export interface LoyaltyCardResponse {
  id: string;
  type: "giftcard";
  event: "card_enquiry";
  /**
   * activated is valid ONLY for card activation responses
   */
  status: "pending" | "complete" | "cancelled" | "activated";
  orderId: string;
  amount: number;
  requestedAppId: string;
  notes: string;
  reference: string;
  expiryDate: string;
  cancelledReason: string;
  posTerminalId: string;
  processedByApp: number;
  uri: string;
  log: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyCardRequest {
  event: "card_enquiry";
  /**
   * complete and cancelled are valid for card enquiry requests
   * cancelled and activated are valid for card activation requests
   */
  status: "complete" | "cancelled" | "activated";
  amount: number;
  expiryDate: string;
  reference: string;
  cancelledReason: string;
  log: {
    employeeId: number;
    employeePosRef: string;
    employeeName: string;
    deviceRef: string;
    deviceName: string;
    area: string;
  };
}

export interface LoyaltyCheckinRetrievalFilters {
  from?: Date;
  to?: Date;
  offset?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export default class Loyalty {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve loyalty checkins registered by your application for a given location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkInId Optional, ID of the loyalty checkin to retrieve, if not provided all the checkins are retrieved
   * @param filters Optional object with the following filters. Applicable only when requesting all the checkins
   *    from: Minimum creation date and time (in Epoch-time) for the loyalty checkin.
   *    to: Maximum create date and time (in Epoch-time) for the loyalty checkin.
   *    offset: Number of matching records to skip before returning the matches, default is 0
   *    limit: Max number of records to return, default is 50, max is 100 (1000 in read-only service)
   *    sort: Sort loyalty checkins ascending or descending based on creation date. Default is desc.
   * @param returns The requested loyalty checkin
   */
  async getCheckins(
    locationId: string,
    checkInId?: string,
    filters?: LoyaltyCheckinRetrievalFilters
  ): Promise<Array<LoyaltyCheckinResponse> | LoyaltyCheckinResponse> {
    let req: AxiosRequestConfig = {
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    };
    if (checkInId) {
      return this.requestMaker({
        ...req,
        url: `/loyalty/checkins/${checkInId}`,
      });
    } else {
      let params: any = filters;
      if (filters) {
        if (filters.from)
          params.from = Math.floor(filters.from.getTime() / 1000);
        if (filters.to) params.to = Math.floor(filters.to.getTime() / 1000);
      }
      return this.requestMaker({
        ...req,
        url: "/loyalty/checkins",
        params,
      });
    }
  }

  /**
   * Retrieve loyalty checkins registered by your application for a given location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param filters Optional object with the following filters. Applicable only when requesting all the checkins
   *    from: Minimum creation date and time (in Epoch-time) for the loyalty checkin.
   *    to: Maximum create date and time (in Epoch-time) for the loyalty checkin.
   *    offset: Number of matching records to skip before returning the matches, default is 0
   *    limit: Max number of records to return, default is 50, max is 100 (1000 in read-only service)
   *    sort: Sort loyalty checkins ascending or descending based on creation date. Default is desc.
   * @param returns The requested loyalty checkins
   */
  async getAllCheckins(
    locationId: string,
    filters?: {
      from?: Date;
      to?: Date;
      offset?: number;
      limit?: number;
      sort?: "asc" | "desc";
    }
  ): Promise<Array<LoyaltyCheckinResponse>> {
    return this.getCheckins(locationId, undefined, filters) as Promise<
      Array<LoyaltyCheckinResponse>
    >;
  }

  /**
   * Retrieve loyalty checkins registered by your application for a given location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkInId ID of the loyalty checkin to retrieve, if not provided all the checkins are retrieved
   * @param returns The requested loyalty checkin
   */
  async getOneCheckin(locationId: string, checkinId: string) {
    return this.getCheckins(
      locationId,
      checkinId
    ) as Promise<LoyaltyCheckinResponse>;
  }

  /**
   * Create a loyalty checkin for your App and location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param data checkin data
   * @returns The registered loyalty checkin
   */
  async createCheckin(
    locationId: string,
    data: LoyaltyCheckinRequest
  ): Promise<LoyaltyCheckinResponse> {
    return this.requestMaker({
      url: "/loyalty/checkins",
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Update the details of a loyalty checkin registered to your application
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkinId The ID of the loyalty checkin to update
   * @param data checkin data
   * @returns The loyalty checkin
   */
  async updateCheckin(
    locationId: string,
    checkinId: string,
    data: LoyaltyCheckinRequest
  ): Promise<LoyaltyCheckinResponse> {
    return this.requestMaker({
      url: `/loyalty/checkins/${checkinId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Remove a loyalty checkin from Doshii. It is only possible to delete loyalty checkins orignally created by the Loyalty App.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkinId The ID of the loyalty checkin to delete
   * @returns status code of the operation
   */
  async deleteCheckin(
    locationId: string,
    checkinId: string
  ): Promise<{ message: string }> {
    return this.requestMaker({
      url: `/loyalty/checkins/${checkinId}`,
      method: "DELETE",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Respond to a member enquiry
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param enquiryId The ID of the loyalty member enquiry request to update
   * @param data the data to respond with
   */
  async respondToEnquiry(
    locationId: string,
    enquiryId: string,
    data: LoyaltyMemberEnquiryRequest
  ): Promise<LoyaltyMemberEnquiryResponse> {
    return this.requestMaker({
      url: `/loyalty/members/enquiry/${enquiryId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Respond to a request to register activity against a loyalty member
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param activityId The ID of the loyalty member activity to update
   * @param data the data to respond with
   */
  async respondToActivityRegisterRequest(
    locationId: string,
    activityId: string,
    data: LoyaltyMemberActivityRequest
  ): Promise<LoyaltyMemberActivityResponse> {
    return this.requestMaker({
      url: `/loyalty/members/activity/${activityId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Retrieve a request to enquire on the balance of a loyalty / gift card.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param requestId The ID of the enquiry request you'd like to retrieve
   * @returns The enquiry request
   */
  async getCardEnquiryRequest(
    locationId: string,
    requestId: string
  ): Promise<LoyaltyCardResponse> {
    return this.requestMaker({
      url: `/loyalty/cards/enquiry/${requestId}`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Update a request to enquire on the balance of a loyalty / gift card.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param requestId The ID of the enquiry request you'd like to update
   * @param data the response data
   * @returns The enquiry request
   */
  async respondToCardEnquiry(
    locationId: string,
    requestId: string,
    data: LoyaltyCardRequest
  ): Promise<LoyaltyCardResponse> {
    return this.requestMaker({
      url: `/loyalty/cards/enquiry/${requestId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Retrieve all Logs for a Loyalty / Gift Card balance enquiry request. Data will be returned chronologically.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param requestId The ID of the enquiry request you'd like to retrieve
   * @returns The audit logs for the request
   */
  async getCardEnquiryLogs(
    locationId: string,
    requestId: string
  ): Promise<Array<LogsResponse>> {
    return this.requestMaker({
      url: `/loyalty/cards/enquiry/${requestId}/logs`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Retrieve a request to activate a loyalty / gift card.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param requestId The ID of the activation request you'd like to retrieve
   * @returns The activation request
   */
  async getCardActivationRequest(
    locationId: string,
    requestId: string
  ): Promise<LoyaltyCardResponse> {
    return this.requestMaker({
      url: `/loyalty/cards/activation/${requestId}`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Update a request to activate a loyalty / gift card.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param requestId The ID of the activation request you'd like to retrieve
   * @param data Data to respond with
   * @returns The activation request
   */
  async respondToCardActivation(
    locationId: string,
    requestId: string,
    data: LoyaltyCardRequest
  ): Promise<LoyaltyCardResponse> {
    return this.requestMaker({
      url: `/loyalty/cards/activation/${requestId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Retrieve all Logs for a Loyalty / Gift Card Activation request. Data will be returned chronologically.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param requestId The ID of the activation request you'd like to retrieve
   * @returns The audit logs for the request
   */
  async getCardActivationLogs(
    locationId: string,
    requestId: string
  ): Promise<LogsResponse> {
    return this.requestMaker({
      url: `/loyalty/cards/activation/${requestId}/logs`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }
}
