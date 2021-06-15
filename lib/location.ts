import { AxiosRequestConfig } from "axios";

/**
 * Location API
 */
export default class Location {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve Locations associated with the App/Partner
   * @param locationId hashed ID of the location to be retrieved.
   * If not provided all the linked locations are returned
   * @returns the location details
   */
  async get(locationId?: string) {
    let requestData: AxiosRequestConfig = {
      method: "GET",
    };
    if (locationId) {
      requestData = {
        url: `/locations/${locationId}`,
        headers: {
          "doshii-location-id": locationId,
        },
      };
    } else {
      requestData = { url: "/locations" };
    }
    return await this.requestMaker(requestData);
  }

  /**
   * Retrieve Location health
   * @param locationId hashed ID of the location.
   * If not provided all the linked location health data are returned
   * @returns location health details
   */
  async getHealth(locationId?: string) {
    let requestData: AxiosRequestConfig = {
      method: "GET",
    };
    if (locationId) {
      requestData = {
        url: `/health/locations/${locationId}`,
        headers: {
          "doshii-location-id": locationId,
        },
      };
    } else {
      requestData = {
        url: "/health/locations",
      };
    }
    return await this.requestMaker(requestData);
  }

  /**
   * Retrieve a list of POS terminals registered at a Location
   * @param locationId hashed ID of the location.
   * @param terminalId ID of the terminal.
   * If not provided all the registered terminals are returned
   * @returns terminal details
   */
  async getTerminal(locationId: string, terminalId?: string) {
    let requestData: AxiosRequestConfig = {
      headers: {
        "doshii-location-id": locationId,
      },
      method: "GET",
    };
    if (terminalId) {
      requestData = {
        ...requestData,
        url: `/terminals/${terminalId}`,
      };
    } else {
      requestData = {
        ...requestData,
        url: "/terminals",
      };
    }
    return await this.requestMaker(requestData);
  }

  /**
   * Subscribe to a Location to obtain access to the location's events and data
   * @param locationId hashed ID of the location.
   * @returns Subscription operation status
   */
  async subscribeTo(locationId: string) {
    return await this.requestMaker({
      url: `/locations/${locationId}/subscription`,
      headers: {
        hashedLocationId: locationId,
      },
      method: "POST",
    });
  }

  /**
   * Unsubscribe from a Location to stop receiving events from that location
   * @param locationId hashed ID of the location.
   * @returns Unsubscription operation status
   */
  async unSubscribeFrom(locationId: string) {
    return await this.requestMaker({
      url: `/locations/${locationId}/subscription`,
      headers: {
        hashedLocationId: locationId,
      },
      method: "DELETE",
    });
  }
}
