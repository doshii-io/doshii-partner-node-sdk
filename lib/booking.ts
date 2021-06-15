import { AxiosRequestConfig } from "axios";

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
  async get(locationId: string, bookingId?: string) {
    let url = "/bookings";
    if (bookingId) {
      url += `/${bookingId}`;
    }
    return await this.requestMaker({
      url,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Retrieve a list of all logs for a Booking
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param bookingId ID of the booking to retrieve
   * @returns The audit logs for the reservation
   */
  async getLogs(locationId: string, bookingId: string) {
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
  async createBooking(locationId: string, data: any) {
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
  async updateBooking(locationId: string, bookingId: string, data: any) {
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
  async deleteBooking(locationId: string, bookingId: string) {
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
  async createCheckin(locationId: string, bookingId: string, data: any) {
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
