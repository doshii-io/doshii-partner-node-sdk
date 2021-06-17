import { AxiosRequestConfig } from "axios";

export default class Checkin {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   *
   * Retrieve Checkins for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkinId The ID of the checkin you'd like to retrieve, if not provided
   * all checkins in the location are retrieved
   * @param options Optional filters
   *    from: Minimum checkin creation date and time (in Epoch-time), default is 60 mins ago
   *    to: Maximum checkin creation date and time (in Epoch-time), default is 60 mins ahead
   *    updatedFrom: Minimum checkin update date and time (in Epoch-time), no default
   *    updatedTo: Maximum checkin update date and time (in Epoch-time), no default
   *    offset: Number of matching records to skip before returning the matches, default is 0
   *    limit: Max number of records to return, default is 50, max is 250
   * @returns The checkins that match the criteria
   */
  async get(
    locationId: string,
    checkinId?: string,
    options?: {
      from?: Date;
      to?: Date;
      updatedFrom?: Date;
      updatedTo?: Date;
      offset?: number;
      limit?: number;
    }
  ) {
    let req: AxiosRequestConfig = {
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    };
    if (checkinId) {
      return this.requestMaker({
        ...req,
        url: `/checkins/${checkinId}`,
      });
    } else {
      let params: any = options;
      if (options) {
        if (options.from)
          params.from = Math.floor(options.from.getTime() / 1000);
        if (options.to) params.to = Math.floor(options.to.getTime() / 1000);
        if (options.updatedFrom)
          params.updatedFrom = Math.floor(options.updatedFrom.getTime() / 1000);
        if (options.updatedTo)
          params.updatedTo = Math.floor(options.updatedTo.getTime() / 1000);
      }
      return this.requestMaker({
        ...req,
        url: "/checkins",
        params,
      });
    }
  }

  /**
   * Retrieve all orders for a checkin.
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkinId The ID of the checkin you'd like to retrieve
   * @param options Optional filters
   *    status: Filter by order status. Defaults to all orders.
   * @returns A list of orders for the supplied checkin
   */
  getOrders(
    locationId: string,
    checkinId: string,
    options?: {
      status:
        | "pending"
        | "rejected"
        | "accepted"
        | "complete"
        | "cancelled"
        | "venue_cancelled";
    }
  ) {
    return this.requestMaker({
      url: `/checkins/${checkinId}/orders`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }

  /**
   * Create a new Checkin for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param data Checkin data
   * @returns The checkin that was created
   */
  create(locationId: string, data: any) {
    return this.requestMaker({
      url: "/checkins",
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Update the details of a Checkin
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkinId The ID of the checkin you'd like to update
   * @param data Checkin data
   * @returns The checkin that was updated
   */
  update(locationId: string, checkinId: string, data: any) {
    return this.requestMaker({
      url: `/checkins/${checkinId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }
}
