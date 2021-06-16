import { AxiosRequestConfig } from "axios";

export default class Menu {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve a Menu for a Location by its hashed ID
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param options Optional object with the following filters
   *    lastVersion: A hash of the last version of the menu to determine if there have been any changes since.
   *    filtered: Indicates whether or not to retrieve a filtered view of the menu based on the requesting App.
   * @returns The requested location's menu
   */
  async get(
    locationId: string,
    options?: {
      lastVersion?: string;
      filtered?: boolean;
    }
  ) {
    return await this.requestMaker({
      url: `/locations/${locationId}/menu`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }

  /**
   * Retrieve a Menu product for the given location and posId
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param posId The POS ID of the product
   * @param options Optional filters
   *  filtered: Indicates whether or not to retrieve a filtered view of the menu item based on the requesting App.
   * @returns The requested location's menu item
   */
  async getProducts(
    locationId: string,
    posId: string,
    options?: {
      filtered: boolean;
    }
  ) {
    return await this.requestMaker({
      url: `/locations/${locationId}/menu/products/${posId}`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }

  /**
   * Retrieve a Menu option for the given location and posId
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param posId The POS ID of the product
   * @param options Optional filters
   *  filtered: Indicates whether or not to retrieve a filtered view of the menu item based on the requesting App.
   * @returns The requested location's menu option matching the supplied posId
   */
  async getProductOptions(
    locationId: string,
    posId: string,
    options?: {
      filtered: boolean;
    }
  ) {
    return await this.requestMaker({
      url: `/locations/${locationId}/menu/options/${posId}`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }

  /**
   * Retrieve a Menu surcount for the given location and posId
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param posId The POS ID of the product
   * @param options Optional filters
   *  filtered: Indicates whether or not to retrieve a filtered view of the menu item based on the requesting App.
   * @returns The requested location's menu surcount
   */
  async getSurcounts(
    locationId: string,
    posId: string,
    options?: {
      filtered: boolean;
    }
  ) {
    return await this.requestMaker({
      url: `/locations/${locationId}/menu/surcounts/${posId}`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
      params: options,
    });
  }
}
