import { AxiosRequestConfig } from "axios";
import { Consumer } from "./sharedSchema";
import { CheckinRequest, CheckinResponse } from "./checkin";

export enum BookingStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  ACKNOWLEDGED = "acknowkegded",
  CANCELLED = "cancelled",
  CUST_CANCELLED = "cust_cancelled",
}

export interface BookingResponse {
  id: string;
  status: BookingStatus;
  tableNames: Array<string>;
  date: string;
  covers: number;
  notes: string;
  ref: string;
  consumer: Consumer;
  checkin: CheckinResponse;
  posTerminalId: string;
  updatedAt: string;
  createdAt: string;
  uri: string;
  version: string;
}

export interface BookingResponses {
  count: number;
  offset: number;
  limit: number;
  rows: Array<BookingResponse>;
}

export interface BookingRequest {
  status: BookingStatus;
  tableNames: Array<string>;
  date: string;
  covers: number;
  notes: string;
  ref: string;
  consumer: Consumer;
  version?: string;
}

export interface BookingLogsResponse {
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

export default class Booking {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve Bookings for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to retrieve, if not provided all the bookings
   * in the location are retrived
   * @returns bookings for a location
   */
  async get(
    locationId: string,
    bookingId?: string,
    filters?: {
      from?: Date;
      to?: Date;
      offset?: number;
      limit?: number;
    }
  ): Promise<BookingResponses | BookingResponse> {
    let url = "/bookings";
    let params: any;
    if (bookingId) {
      url += `/${bookingId}`;
    } else if (filters) {
      params = filters;
      if (filters.from) params.from = Math.floor(filters.from.getTime() / 1000);
      if (filters.to) params.to = Math.floor(filters.to.getTime() / 1000);
    }
    return await this.requestMaker({
      url,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params,
    });
  }

  /**
   * Retrieve all Bookings for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @returns bookings for a location
   */

  async getAll(
    locationId: string,
    filters?: {
      from?: Date;
      to?: Date;
      offset?: number;
      limit?: number;
    }
  ): Promise<BookingResponses> {
    return this.get(
      locationId,
      undefined,
      filters
    ) as Promise<BookingResponses>;
  }

  /**
   * Retrieve a specific Booking for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to retrieve
   * @returns the requested booking for a location
   */
  async getOne(
    locationId: string,
    bookingId: string
  ): Promise<BookingResponse> {
    return this.get(locationId, bookingId) as Promise<BookingResponse>;
  }

  /**
   * Retrieve a list of all logs for a Booking
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to retrieve
   * @returns The audit logs for the reservation
   */
  async getLogs(
    locationId: string,
    bookingId: string
  ): Promise<BookingLogsResponse> {
    return await this.requestMaker({
      url: `/bookings/${bookingId}/logs`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Retrieve all preorders against a Booking
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to retrieve
   * @returns The preorders associated to the booking
   */
  async getPreorders(locationId: string, bookingId: string) {
    return await this.requestMaker({
      url: `/bookings/${bookingId}/preorders`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Create a new Booking for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param data Booking data
   * @returns the booking that was created
   */
  async createBooking(
    locationId: string,
    data: BookingRequest
  ): Promise<BookingResponse> {
    return await this.requestMaker({
      url: "/bookings",
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Update a Booking for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to update
   * @param data Booking data
   * @returns the booking that was updated
   */
  async updateBooking(
    locationId: string,
    bookingId: string,
    data: BookingRequest
  ): Promise<BookingResponse> {
    return await this.requestMaker({
      url: `/bookings/${bookingId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Remove a Booking by its ID
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to delete
   * @returns Status code of the operation
   */
  async deleteBooking(
    locationId: string,
    bookingId: string
  ): Promise<{ message: string }> {
    return await this.requestMaker({
      url: `/bookings/${bookingId}`,
      method: "DELETE",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Create a new Checkin against a Booking
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to checkin
   * @param data Checkin data
   * @returns Checking that was created
   */
  async createCheckin(
    locationId: string,
    bookingId: string,
    data: CheckinRequest
  ): Promise<BookingResponse> {
    return await this.requestMaker({
      url: `/bookings/${bookingId}/checkin`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Create a new preorder against a Booking
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to preorder
   * @param data Preorder data
   * @returns The preorder that was created
   */
  async createPreorder(locationId: string, bookingId: string, data: any) {
    return await this.requestMaker({
      url: `/bookings/${bookingId}/preorder`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }
}
