import { AxiosRequestConfig } from "axios";
import { OrderResponse, OrderStatus } from "./order";
import { BookingResponses, BookingStatus } from "./booking";
import { CheckinResponse } from "./checkin";

export interface TableResponse {
  name: string;
  maxCovers: number;
  isActive: boolean;
  revenueCentre: string;
  criteria: {
    isCommunal: boolean;
    canMerge: boolean;
    isSmoking: boolean;
    isOutdoor: boolean;
  };
  updatedAt: string;
  createdAt: string;
  uri: string;
}

export default class Table {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve a list of all Tables for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param name Optional name of the table you'd like to retrieve bookings for, providing
   * this is ignore the filters
   * @param filters an optional object with the following filters
   *    id: List of table IDs.
   *    isActive: etrieves all tables that have their isActive property matching the specified value.
   *    covers: Retrieves all tables that have been configured to support at least the number of covers supplied.
   * @returns List of Tables for a Location
   */
  async get(
    locationId: string,
    name?: string,
    filters?: {
      id?: Array<string>;
      isActive?: boolean;
      covers?: string;
    }
  ): Promise<Array<TableResponse> | TableResponse> {
    let req: AxiosRequestConfig = {
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    };
    if (name) {
      return this.requestMaker({
        ...req,
        url: `/tables/${name}`,
      });
    } else {
      return this.requestMaker({
        ...req,
        url: "/tables",
        params: filters,
      });
    }
  }

  /**
   * Retrieve a specific Table
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param name: retrive using name
   * @returns the requested table
   */
  async getOne(locationId: string, name: string) {
    return this.get(locationId, name) as Promise<TableResponse>;
  }

  /**
   * Retrieve a list of all Tables for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param filters an optional object with the following filters
   *    id: List of table IDs.
   *    isActive: etrieves all tables that have their isActive property matching the specified value.
   *    covers: Retrieves all tables that have been configured to support at least the number of covers supplied.
   * @returns List of Tables for a Location
   */
  async getAll(
    locationId: string,
    filters: {
      id?: Array<string>;
      isActive?: boolean;
      covers?: string;
    }
  ): Promise<Array<TableResponse>> {
    return this.get(locationId, undefined, filters) as Promise<
      Array<TableResponse>
    >;
  }

  /**
   * Retrieve a list of all Bookings that apply to a Table by the Tables' name
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param name The name of the table you'd like to retrieve bookings for
   * @param options Optional filters
   * @returns A list of reservations for the supplied table
   */
  async getBookings(
    locationId: string,
    name: string,
    options?: {
      status?: BookingStatus;
      seated?: boolean;
    }
  ): Promise<BookingResponses> {
    return await this.requestMaker({
      url: `/tables/${name}/bookings`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }
  /**
   * Retrieve a list of all Checkins that apply to a Table by the Tables' name
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param name The name of the table you'd like to retrieve checkins for
   * @returns A list of checkins for the supplied table
   */
  async getCheckins(
    locationId: string,
    name: string
  ): Promise<Array<CheckinResponse>> {
    return await this.requestMaker({
      url: `/tables/${name}/checkins`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Retrieve a list of all Orders that apply to a Table by the Tables' name
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param name The name of the table you'd like to retrieve orders for
   * @returns
   */
  async getOrders(
    locationId: string,
    name: string,
    options?: {
      status: OrderStatus;
    }
  ): Promise<Array<OrderResponse>> {
    return await this.requestMaker({
      url: `/tables/${name}/orders`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }
}
