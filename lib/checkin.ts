import { AxiosRequestConfig } from "axios";
import { OrderResponse, OrderStatus } from "./order";
import { Consumer } from "./sharedSchema";

export interface CheckinResponse {
  id: string;
  status: "pending" | "cancelled" | "accepted" | "rejected" | "complete";
  ref: string;
  tableNames: Array<string>;
  covers: number;
  bookingId: string;
  completedAt: string | null;
  consumer: Consumer;
  rejectionCode: "CH01" | "CH02" | "CH03" | "CH04" | "CH05" | "POSISE";
  rejectionReason: string;
  posTerminalId: string;
  updatedAt: string;
  createdAt: string;
  uri: string;
}

export interface CheckinRequest {
  ref?: string;
  status?: "pending" | "cancelled" | "accepted" | "rejected" | "complete";
  tableNames: Array<string>;
  covers?: number;
  completedAt?: string | null;
  log?: {
    employeeId: number;
    employeePosRef: string;
    employeeName: string;
    deviceRef: string;
    deviceName: string;
    area: string;
  };
  consumer?: Consumer;
}

export interface CheckinRetrievalFilters {
  status?: "pending" | "accepted";
  tableName?: string;
  from?: Date;
  to?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
  offset?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

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
   * @param filters Optional filters
   *    status: String to return active or completed checkins, default is 'pending, accepted'
   *    tableName: Single table name
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
    filters?: CheckinRetrievalFilters
  ): Promise<CheckinResponse | Array<CheckinResponse>> {
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
      let params: any = filters;
      if (filters) {
        if (filters.from)
          params.from = Math.floor(filters.from.getTime() / 1000);
        if (filters.to) params.to = Math.floor(filters.to.getTime() / 1000);
        if (filters.updatedFrom)
          params.updatedFrom = Math.floor(filters.updatedFrom.getTime() / 1000);
        if (filters.updatedTo)
          params.updatedTo = Math.floor(filters.updatedTo.getTime() / 1000);
      }
      return this.requestMaker({
        ...req,
        url: "/checkins",
        params,
      });
    }
  }

  /**
   *
   * Retrieve Checkins for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param options Optional filters
   *    status: String to return active or completed checkins, default is 'pending, accepted'
   *    tableName: Single table name
   *    from: Minimum checkin creation date and time (in Epoch-time), default is 60 mins ago
   *    to: Maximum checkin creation date and time (in Epoch-time), default is 60 mins ahead
   *    updatedFrom: Minimum checkin update date and time (in Epoch-time), no default
   *    updatedTo: Maximum checkin update date and time (in Epoch-time), no default
   *    offset: Number of matching records to skip before returning the matches, default is 0
   *    limit: Max number of records to return, default is 50, max is 250
   * @returns The checkins that match the criteria
   */
  async getAll(
    locationId: string,
    filters?: CheckinRetrievalFilters
  ): Promise<Array<CheckinResponse>> {
    return this.get(locationId, undefined, filters) as Promise<
      Array<CheckinResponse>
    >;
  }

  /**
   *
   * Retrieve Checkins for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param checkinId The ID of the checkin you'd like to retrieve
   * @returns The requsted checkin
   */
  async getOne(locationId: string, checkingId: string) {
    return this.get(locationId, checkingId) as Promise<CheckinResponse>;
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
      status: OrderStatus;
    }
  ): Promise<Array<OrderResponse>> {
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
  create(locationId: string, data: CheckinRequest): Promise<CheckinResponse> {
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
  update(
    locationId: string,
    checkinId: string,
    data: CheckinRequest
  ): Promise<CheckinResponse> {
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
