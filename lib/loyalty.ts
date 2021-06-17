import { AxiosRequestConfig } from "axios";

export default class Loyalty {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve loyalty checkins registered by your application for a given location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkInId Optional, ID of the loyalty checkin to retrieve, if not provided all the checkins are retrieved
   * @param options Optional object with the following filters. Applicable only when requesting all the checkins
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
    options?: {
      from?: Date;
      to?: Date;
      offset?: number;
      limit?: number;
      sort?: "asc" | "desc";
    }
  ) {
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
      let params: any = options;
      if (options) {
        if (options.from)
          params.from = Math.floor(options.from.getTime() / 1000);
        if (options.to) params.to = Math.floor(options.to.getTime() / 1000);
      }
      return this.requestMaker({
        ...req,
        url: "/loyalty/checkins",
        params,
      });
    }
  }

  /**
   * Create a loyalty checkin for your App and location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param data checkin data
   * @returns The registered loyalty checkin
   */
  async createCheckin(locationId: string, data: any) {
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
  async updateCheckin(locationId: string, checkinId: string, data: any) {
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
  async deleteCheckin(locationId: string, checkinId: string) {
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
  async respondToEnquiry(locationId: string, enquiryId: string, data: any) {
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
    data: any
  ) {
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
  async getCardEnquiryRequest(locationId: string, requestId: string) {
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
  async respondToCardEnquiry(locationId: string, requestId: string, data: any) {
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
  async getCardEnquiryLogs(locationId: string, requestId: string) {
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
  async getCardActivationRequest(locationId: string, requestId: string) {
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
    data: any
  ) {
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
  async getCardActivationLogs(locationId: string, requestId: string) {
    return this.requestMaker({
      url: `/loyalty/cards/activation/${requestId}/logs`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }
}
