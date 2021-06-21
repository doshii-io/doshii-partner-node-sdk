import { AxiosRequestConfig } from "axios";

export type LocationResponse = {
  id: string;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  timezone?: string;
  phoneNumber: string | null;
  email?: string;
  publicWebsiteUrl?: string;
  mappedLocationId?: string;
  classification?:
    | "Accommodation"
    | "Amateur"
    | "Sport"
    | "Bakery"
    | "Bar"
    | "Café"
    | "Cinema"
    | "Club"
    | "Education"
    | "Golf"
    | "Club"
    | "Gym"
    | "Pub"
    | "QSR"
    | "Restaurant"
    | "Takeaway"
    | "Food"
    | "Test";
  vendor?: string;
  organisationId: string;
  updatedAt: string;
  createdAt: string;
  uri: string;
  operatingHours:
    | []
    | [
        {
          standard: boolean;
          status: "opened" | "closed";
          dates: [
            {
              day: number;
              month: number;
              year: number;
            }
          ];
          time: {
            from: string;
            to: string;
          };
          daysOfWeek: Array<
            "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
          >;
          effective: {
            from: string;
            to: string;
          };
        }
      ];
  capability: {
    healthCheck: boolean;
    orderPreProcess: boolean;
    autoCompleteCheckin: boolean;
  };
  imageUri?: string;
};

export type LocationHealth = {
  locationId: string;
  name: string;
  communicationType: "websockets" | "webhooks";
  heartbeat: string;
  status: string;
  trading: boolean;
  locationTime: string;
  prepTimes: {
    dinein: number;
    pickup: number;
    delivery: number;
  };
  locationUri: string;
};

export type LocationTerminal = {
  doshiiId: string;
  name: string;
  ref: string;
  area: string;
  description: string;
  locationId: string;
  updatedAt: string;
  createdAt: string;
  uri: string;
};

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
  async get(
    locationId?: string
  ): Promise<Array<LocationResponse> | LocationResponse> {
    let requestData: AxiosRequestConfig = {
      method: "GET",
    };
    if (locationId) {
      requestData = {
        ...requestData,
        url: `/locations/${locationId}`,
        headers: {
          "doshii-location-id": locationId,
        },
      };
    } else {
      requestData = { ...requestData, url: "/locations" };
    }
    return await this.requestMaker(requestData);
  }

  /**
   * Retrieve all Locations associated with the App/Partner
   * @returns the location details
   */
  async getAll(): Promise<Array<LocationResponse>> {
    return this.get() as Promise<Array<LocationResponse>>;
  }

  /**
   * Retrieve the specified Locations associated with the App/Partner
   * @param locationId hashed ID of the location to be retrieved.
   * @returns the location details
   */
  async getOne(locationId: string): Promise<LocationResponse> {
    return this.get(locationId) as Promise<LocationResponse>;
  }

  /**
   * Retrieve Location health
   * @param locationId hashed ID of the location.
   * If not provided all the linked location health data are returned
   * @returns location health details
   */
  async getHealth(
    locationId?: string
  ): Promise<Array<LocationHealth> | LocationHealth> {
    let requestData: AxiosRequestConfig = {
      method: "GET",
    };
    if (locationId) {
      requestData = {
        ...requestData,
        url: `/health/locations/${locationId}`,
        headers: {
          "doshii-location-id": locationId,
        },
      };
    } else {
      requestData = {
        ...requestData,
        url: "/health/locations",
      };
    }
    return await this.requestMaker(requestData);
  }

  /**
   * Retrieve a specific Location health
   * @param locationId hashed ID of the location.
   * @returns location health details
   */
  async getOneHealth(locationId: string): Promise<LocationHealth> {
    return this.getHealth(locationId) as Promise<LocationHealth>;
  }

  /**
   * Retrieve all Location health
   * @returns location health details
   */
  async getAllHealths(): Promise<Array<LocationHealth>> {
    return this.getHealth() as Promise<Array<LocationHealth>>;
  }

  /**
   * Retrieve a list of POS terminals registered at a Location
   * @param locationId hashed ID of the location.
   * @param terminalId ID of the terminal.
   * If not provided all the registered terminals are returned
   * @returns terminal details
   */
  async getTerminal(
    locationId: string,
    terminalId?: string
  ): Promise<Array<LocationTerminal> | LocationTerminal> {
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
   * Retrieve a POS terminal registered at a Location
   * @param locationId hashed ID of the location.
   * @param terminalId ID of the terminal.
   * @returns terminal details
   */
  async getOneTerminal(locationId: string, terminalId: string) {
    return this.getTerminal(
      locationId,
      terminalId
    ) as Promise<LocationTerminal>;
  }

  /**
   * Retrieve all list of POS terminals registered at a Location
   * @param locationId hashed ID of the location.
   * @returns terminal details
   */
  async getAllTerminals(locationId: string) {
    return this.getTerminal(locationId) as Promise<Array<LocationTerminal>>;
  }

  /**
   * Subscribe to a Location to obtain access to the location's events and data
   * @param locationId hashed ID of the location.
   * @param data The references and features enabled for this specific location subscription
   * @returns Subscription operation status
   */
  async subscribeTo(
    locationId: string,
    data?: {
      mappedLocationId?: string;
      useFilteredMenu?: boolean;
    }
  ): Promise<{ message: string }> {
    return await this.requestMaker({
      url: `/locations/${locationId}/subscription`,
      headers: {
        hashedLocationId: locationId,
      },
      method: "POST",
      data,
    });
  }

  /**
   * Unsubscribe from a Location to stop receiving events from that location
   * @param locationId hashed ID of the location.
   * @returns Unsubscription operation status
   */
  async unSubscribeFrom(locationId: string): Promise<{ message: string }> {
    return await this.requestMaker({
      url: `/locations/${locationId}/subscription`,
      headers: {
        hashedLocationId: locationId,
      },
      method: "DELETE",
    });
  }
}
