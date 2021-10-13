import { AxiosRequestConfig } from "axios";
import { Surcount } from "./sharedSchema";

interface MenuAltNames {
  default: {
    display: string;
    kitchen: string;
    default: string;
  };
  additionalProperties: {
    display: string;
    kitchen: string;
    default: string;
  };
}
interface MenuVariant {
  posId: string;
  name: string;
  price: string;
  alternateNames?: MenuAltNames;
}
interface MenuOptions {
  posId: string;
  name: string;
  min: string;
  max: string;
  variants: Array<MenuVariant>;
  alternateNames: MenuAltNames;
}
interface MenuProductIds {
  "gtin-8": string;
  "gtin-12": string;
  "gtin-13": string;
  "gtin-14": string;
  sku: string;
  plu: string;
  barcodes: Array<string>;
}
interface MenuIncludedItem {
  posId: string;
  productIds?: MenuProductIds;
  name: string;
  quantity: number;
  unitPrice: number;
  options: Array<MenuOptions>;
  alternateNames?: MenuAltNames;
}
interface MenuBundledItem {
  posId?: string;
  name: string;
  min: number;
  max: number;
  includedItems: Array<MenuIncludedItem>;
}
export interface MenuProduct {
  posId: string;
  name: string;
  type: "single" | "bundle";
  availability: "available" | "unavailable";
  productIds: MenuProductIds;
  description: string;
  unitPrice: number;
  tags: Array<string>;
  dietary: Array<
    | "contains-alcohol"
    | "contains-dairy"
    | "contains-nuts"
    | "gluten-free"
    | "spicy"
    | "vegan"
    | "vegetarian"
  >;
  menuDir: Array<string>;
  includedItems: Array<MenuIncludedItem>;
  bundledItems?: Array<MenuBundledItem>;
  options: Array<MenuOptions>;
  surcounts: Array<Surcount>;
  alternateNames?: MenuAltNames;
  imageUri: string;
}
export interface MenuResponse {
  description: string;
  imageUri: string;
  surcounts: Array<Surcount>;
  options: Array<MenuOptions>;
  products: Array<MenuProduct>;
  updatedAt: string;
  createdAt: string;
  version: string;
  uri: string;
}

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
  ): Promise<MenuResponse> {
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
  async getProduct(
    locationId: string,
    posId: string,
    options?: {
      filtered: boolean;
    }
  ): Promise<MenuProduct> {
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
  ): Promise<MenuOptions> {
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
  ): Promise<Surcount> {
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
