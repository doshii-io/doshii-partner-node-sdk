import { AxiosRequestConfig } from "axios";

export default class Table {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve a list of all Tables for a Location
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param options an optional object with the following filters
   *    name: retrive using name, providing this will ignore the rest of the the filters
   *    id: List of table IDs.
   *    isActive: etrieves all tables that have their isActive property matching the specified value.
   *    covers: Retrieves all tables that have been configured to support at least the number of covers supplied.
   * @returns List of Tables for a Location
   */
  async get(
    locationId: string,
    name?: string,
    options?: {
      id?: Array<string>;
      isActive?: boolean;
      covers?: string;
    }
  ) {
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
      let params = options;
      return this.requestMaker({
        ...req,
        url: "/tables",
        params,
      });
    }
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
      status?:
      | "pending"
      | "rejected"
      | "accepted"
      | "acknowledged"
      | "cancelled"
      | "cust_cancelled";
      seated?: boolean;
    }
  ) {
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
  async getCheckins(locationId: string, name: string) {
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
      status?:
      | "pending"
      | "rejected"
      | "accepted"
      | "complete"
      | "cancelled"
      | "venue_cancelled";
    }
  ) {
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
