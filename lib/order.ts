import { AxiosRequestConfig } from "axios";
import { CheckinResponse } from "./checkin";
import {
  Consumer,
  LogsRequest,
  Product,
  Surcount,
} from "./sharedSchema";
import { TransactionRequest, TransactionResponse } from "./transaction";

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  COMPLETE = "complete",
  VENUE_CANCELLED = "venue_cancelled",
}

export type Tax = {
  posId?: string;
  name: string;
  amount: string;
  type: "absolute" | "percentage";
  taxType: "exclusive" | "inclusive";
  value: string;
};
export interface ProductWithTaxes extends Product {
  taxes: Array<Tax>;
}
export interface AddItemToOrderRequest
  extends Omit<ProductWithTaxes, "uuid" | "rewardRef"> {}

export enum MealPhase {
  ORDERED = "Ordered",
  DELAYED = "Delayed",
  APPETISER_PREPARING = "appetiser_preparing",
  ENTREE_PREPARING = "entree_preparing",
  MAIN_PREPARING = "main_preparing",
  DESSERT_PREPARING = "dessert_preparing",
  APPETISER_PREPARED = "appetiser_prepared",
  ENTREE_PREPARED = "entree_prepared",
  MAIN_PREPARED = "main_prepared",
  DESSERT_PREPARED = "dessert_prepared",
  APPETISER_SERVED = "appetiser_prepared",
  ENTREE_SERVED = "entree_served",
  MAIN_SERVED = "main_served",
  DESSERT_SERVED = "dessert_served",
  BILLED = "billed",
  FULFILLED = "fulfilled",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
}

export enum DeliveryStatus {
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  FAILED = "failed",
}
export interface OrderResponse {
  id: string;
  posRef: string;
  externalOrder: string;
  deliveryOrderId: string;
  locationId: string;
  checkinId: string;
  manuallyProcessed: boolean;
  mealPhase: MealPhase;
  status: OrderStatus;
  type: "delivery" | "pickup" | "dinein";
  notes: string;
  revenueCentre: string;
  requiredAt: string;
  availableEta: string;
  items: Array<ProductWithTaxes>;
  unapprovedItems: Array<ProductWithTaxes>;
  consumer: Consumer;
  surcounts: Array<Surcount>;
  taxes: Array<Tax> | null;
  checkin: CheckinResponse;
  rejectionCode:
    | "01"
    | "02"
    | " 03"
    | " 04"
    | " 05"
    | " 06"
    | " 07"
    | " 08"
    | " 09"
    | " 010"
    | " 012"
    | " 013"
    | " MAR1"
    | " MAR2"
    | " MAR3"
    | " POSSIE";
  delivery: {
    status: DeliveryStatus;
    displayId: string;
    phase?: string;
    failedReason: string;
    deliveryEta: string;
    driverName: string;
    driverPhone: string;
    trackingUrl: string;
  };
  transactions: Array<TransactionResponse>;
  rejectionReason: string;
  preorderBookingId: string;
  posTerminalId: string;
  posDisplayId: string;
  posCreatedAt: string;
  updatedAt: string;
  createdAt: string;
  version: string;
  uri: string;
  transactionUri: string;
}
export interface OrderResponses {
  count: number;
  offset: number;
  limit: number;
  rows: Array<OrderResponse>;
}
export interface OrderPreprocess {
  checkinId?: string;
  externalOrderRef: string;
  manuallyProcessed?: boolean;
  status: OrderStatus;
  type: "delivery" | "pickup" | "dinein";
  revenueCentre?: string;
  notes?: string;
  requiredAt?: string;
  availableEta?: string;
  items: Array<ProductWithTaxes>;
  surcounts: Array<Surcount>;
  taxes?: Array<Tax>;
  log?: LogsRequest;
}
export interface OrderRequest {
  order: OrderPreprocess;
  consumer: Consumer;
  transactions?: Array<TransactionRequest>;
  members?: Array<string>;
  posTerminalId?: string;
}

export interface OrderRetrievalFilters {
  /**Comma separated list of statuses.
   * Defaults to accepting all. eg. pending,accepted. */
  status?: Array<OrderStatus>;
  /**The POS reference for the order. */
  posRef?: string;
  /**The optional external order
   * reference provided by the Partner when the order was created. */
  externalOrderRef?: string;
  /**A Unix timestamp (seconds) that orders were created at or later than */
  from?: Date;
  /**A Unix timestamp (seconds) that orders were created at or before than */
  to?: Date;
  /**Sort ascending or descending by order creation date. Default is desc. */
  sort?: "asc" | "desc";
  /**A Unix timestamp (seconds) that orders were last updated at or later than */
  updatedFrom?: Date;
  /**A Unix timestamp (seconds) that orders were last updated at or before than */
  updatedTo?: Date;
  /**Sort ascending or descending by when orders were last updated. Default is desc. */
  updatedSort?: "asc" | "desc";
  /**A Unix timestamp (seconds) that orders were created in the POS at or later than */
  posFrom?: Date;
  /**A Unix timestamp (seconds) that orders were created in the POS at or before than */
  posTo?: Date;
  /**Sort ascending or descending by when orders were created in the POS. Default is desc. */
  posSort?: "asc" | "desc";
  /**Number of matching records to skip before returning the matches, default is 0 */
  offset?: number;
  /**Max number of records to return. Default is 50 (Maximum: 100).
   * If the request is made on the Read-Only service and gzip compression is enabled
   * (e.g. Accept-Encoding: gzip) then the Default becomes 200,
   * with a maximum supported limit of 1,000 records. */
  limit?: number;
}

export default class Order {
  private readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Create a new Order at a Location
   * @param locationId hashed location ID of the location
   * @param data Order data
   * @returns the order created
   */
  async createOrder(
    locationId: string,
    data: OrderRequest
  ): Promise<OrderResponse> {
    return await this.requestMaker({
      headers: {
        "doshii-location-id": locationId,
      },
      url: "/orders",
      method: "POST",
      data,
    });
  }

  /**
   *
   * Retrieve a list of Orders
   * @param locationId hashed location ID of the location
   * @param orderId optional order id to be retrieved,
   * if not provided gets all the orders at the location
   * @param filters optional filters applicable only
   * when getting all orders
   * @returns list of orders
   */
  private async get(
    locationId: string,
    orderId?: string,
    filters?: OrderRetrievalFilters
  ): Promise<OrderResponse | OrderResponses> {
    let requestData: AxiosRequestConfig = {
      headers: {
        "doshii-location-id": locationId,
      },
      method: "GET",
    };
    if (orderId) {
      requestData = {
        ...requestData,
        url: `/orders/${orderId}`,
      };
    } else {
      let params: any = filters;
      if (filters) {
        // convert date to unix timstamp
        if (filters.from)
          params.from = Math.floor(filters.from.getTime() / 1000);
        if (filters.to) params.to = Math.floor(filters.to.getTime() / 1000);
        if (filters.updatedFrom)
          params.updatedFrom = Math.floor(filters.updatedFrom.getTime() / 1000);
        if (filters.updatedTo)
          params.updatedTo = Math.floor(filters.updatedTo.getTime() / 1000);
        if (filters.posFrom)
          params.posFrom = Math.floor(filters.posFrom.getTime() / 1000);
        if (filters.posTo)
          params.posTo = Math.floor(filters.posTo.getTime() / 1000);
        if (filters.status)
          params.status = filters.status.join(',')
      }
      requestData = { ...requestData, url: "/orders", params };
    }
    return await this.requestMaker(requestData);
  }

  /**
   *
   * Retrieve a list of Orders
   * @param locationId hashed location ID of the location
   * @param filters optional filters
   * @returns All orders
   */
  async getAll(locationId: string, filters?: OrderRetrievalFilters) {
    return this.get(locationId, undefined, filters) as Promise<OrderResponses>;
  }

  /**
   *
   * Retrieve a list of Orders
   * @param locationId hashed location ID of the location
   * @param orderId order id to be retrieved,
   * @returns requested order
   */
  async getOne(locationId: string, orderId: string) {
    return this.get(locationId, orderId) as Promise<OrderResponse>;
  }

  /**
   * Update an Order at a Location
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be updated
   * @param data Updated order data
   * @returns The order that was updated
   */
  async update(
    locationId: string,
    orderId: string,
    data: {
      status: OrderStatus;
      mealPhase?: MealPhase;
      version: string;
      log?: LogsRequest;
    }
  ): Promise<OrderResponse> {
    return await this.requestMaker({
      url: `/orders/${orderId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Update the delivery status of an Order at a Location
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be updated
   * @param data Updated data
   * @returns The order that was updated
   */
  async updateDelivery(
    locationId: string,
    orderId: string,
    data: {
      deliveryOrderId?: string;
      status?: DeliveryStatus;
      displayId?: string;
      phase?: string;
      failedReason: string;
      deliveryEta: string;
      driverName: string;
      driverPhone: string;
      trackingUrl: string;
      version: string;
    }
  ): Promise<OrderResponse> {
    return await this.requestMaker({
      url: `/orders/${orderId}/delivery`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Append a list of Items to an order
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be updated
   * @param data updated data
   * @returns The order that was updated
   */
  async addItems(
    locationId: string,
    orderId: string,
    data: Array<AddItemToOrderRequest>
  ): Promise<OrderResponse> {
    return await this.requestMaker({
      url: `/orders/${orderId}/items`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Remove a list of Items from an Order by the Items' hashed ID
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be updated
   * @param data Data to update
   * @returns The order that was deleted
   *
   */
  async removeItems(
    locationId: string,
    orderId: string,
    data: {
      cancelledItems: Array<string>;
      version: string;
      log: LogsRequest;
    }
  ): Promise<OrderResponse> {
    return await this.requestMaker({
      url: `/orders/${orderId}/items`,
      method: "DELETE",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Perform a pre-check on an order with the POS before submitting
   * a new Order at a Location
   * @param locationId hashed location ID of the location
   * @param data Order data
   * @returns The preprocess request that was created
   */
  async preprocess(
    locationId: string,
    data: OrderPreprocess
  ): Promise<{
    id: string;
    locationId: string;
    status: "pending" | " rejected" | " complete ";
    createdAt: string;
  }> {
    return await this.requestMaker({
      url: `/orders/preprocess`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Create a new Transaction against an Order
   * @param locationId hashed location ID of the location
   * @param orderId Order ID
   * @param data Transaction data
   * @returns The transaction that was created
   */
  async createTransaction(locationId: string, orderId: string, data: any) {
    return await this.requestMaker({
      url: `/orders/${orderId}/transactions`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Retrieve a list of transactions associated to an Order by the Order ID
   * @param locationId hashed location ID of the location
   * @param orderId Order ID
   * @returns The transaction that was deleted
   *
   */
  async getTransactions(locationId: string, orderId: string) {
    return await this.requestMaker({
      url: `/orders/${orderId}/transactions`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Register interest in an order for the purposes of
   * receiving Doshii events when the order is updated.
   * @param locationId hashed location ID of the location
   * @param orderId Order ID
   * @returns The order that was updated
   */
  async subscribeTo(
    locationId: string,
    orderId: string
  ): Promise<OrderResponse> {
    return await this.requestMaker({
      url: `/orders/${orderId}/subscription`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Unregister interest in an order that was previously
   * subscribed via the POST subscription endpoint
   * @param locationId hashed location ID of the location
   * @param orderId Order ID
   * @returns The order that was updated
   */
  async unsubscribeFrom(
    locationId: string,
    orderId: string
  ): Promise<{ message: string }> {
    return await this.requestMaker({
      url: `/orders/${orderId}/subscription`,
      method: "DELETE",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }
}
