import { AxiosRequestConfig } from "axios";
import { LogLevel, Logger } from "./utils";

enum OrderStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
  Cancelled = "cancelled",
  Complete = "complete",
  VenueCancelled = "venue_cancelled",
}

type OrderRetrivalFilters = {
  /**Comma separated list of statuses.
   * Defaults to accepting all. eg. pending,accepted. */
  status: string;
  /**The POS reference for the order. */
  posRef: string;
  /**The optional external order
   * reference provided by the Partner when the order was created. */
  externalOrderRef: string;
  /**A Unix timestamp (seconds) that orders were created at or later than */
  from: number;
  /**A Unix timestamp (seconds) that orders were created at or before than */
  to: number;
  /**Sort ascending or descending by order creation date. Default is desc. */
  sort: string;
  /**A Unix timestamp (seconds) that orders were last updated at or later than */
  updatedFrom: number;
  /**A Unix timestamp (seconds) that orders were last updated at or before than */
  updatedTo: number;
  /**Sort ascending or descending by when orders were last updated. Default is desc. */
  updatedSort: string;
  /**A Unix timestamp (seconds) that orders were created in the POS at or later than */
  posFrom: number;
  /**A Unix timestamp (seconds) that orders were created in the POS at or before than */
  posTo: number;
  /**Sort ascending or descending by when orders were created in the POS. Default is desc. */
  posSort: string;
  /**Number of matching records to skip before returning the matches, default is 0 */
  offset: number;
  /**Max number of records to return. Default is 50 (Maximum: 100).
   * If the request is made on the Read-Only service and gzip compression is enabled
   * (e.g. Accept-Encoding: gzip) then the Default becomes 200,
   * with a maximum supported limit of 1,000 records. */
  limit: number;
};

export default class Order {
  private orders = new Map<
    string,
    {
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      status: OrderStatus;
      details: any;
    }
  >();
  private readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;
  private readonly logger: Logger;

  constructor(
    requestMaker: (data: AxiosRequestConfig) => Promise<any>,
    logLevel = LogLevel.ERROR
  ) {
    this.requestMaker = requestMaker;
    this.logger = new Logger(logLevel);
  }

  /*
  Create a new Order at a Location
  */
  async createOrder(locationId: string, data: any) {
    // send create order request to doshii
    const response = await this.requestMaker({
      headers: {
        "doshii-location-id": locationId,
      },
      url: "/orders",
      method: "POST",
      data,
    });

    this.logger.log(response);
    /*
    save to orders so that the status can be 
    updated when recieved from websocket
    which will resolve the returned promise
    */
    let resolveFunc: (value: any) => void;
    let rejectFunc: (reason?: any) => void;
    const result = new Promise((res, rej) => {
      resolveFunc = res;
      rejectFunc = rej;
    });
    this.orders.set(response.id, {
      resolve: resolveFunc!,
      reject: rejectFunc!,
      // status: Order.OrderStatus[response.data.status as string]
      status: response.status,
      details: response,
    });
    this.logger.log(result);
    this.logger.log(this.orders);
    return result;
  }

  orderUpdate(data: any) {
    // check if order id is present in orders
    const promiseControls = this.orders.has(data.id)
      ? this.orders.get(data.id)
      : undefined;

    if (promiseControls) {
      this.logger.debug("Doshii: Got orderUpdate");
      this.logger.debug(data);
      this.logger.log(promiseControls);
      if (data.status == OrderStatus.Complete) {
        // resolve the promise if order is complete and
        // remove from oders cache
        this.logger.log("Order complete -------------");
        this.logger.log(data);
        promiseControls.resolve(data);
        this.orders.delete(data.id);
      } else if (
        [
          OrderStatus.Cancelled,
          OrderStatus.Rejected,
          OrderStatus.VenueCancelled,
        ].includes(data.status)
      ) {
        // Reject promise if order didnt go through
        // remove from oders cache
        this.logger.log("Order rejected -------------");
        this.logger.log(data);
        promiseControls.reject(data);
        this.orders.delete(data.id);
      } else {
        // Update order status in cache
        this.logger.log("Order update -------------");
        this.logger.log(data);
        promiseControls.status = data.status;
        this.logger.log(promiseControls);
      }
    } else {
      this.logger.log("Unknown Order update -------------");
      this.logger.log(data);
    }
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
  async get(
    locationId: string,
    orderId?: string,
    filters?: OrderRetrivalFilters
  ) {
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
      requestData = { ...requestData, url: "/orders", params: filters };
    }
    return await this.requestMaker(requestData);
  }

  /**
   * Update an Order at a Location
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be updated
   * @param data Updated order data
   * @returns The order that was updated
   */
  async update(locationId: string, orderId: string, data: any) {
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
  async updateDelivery(locationId: string, orderId: string, data: any) {
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
   * Retrieve all logs for an Order
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be retrieved
   * @returns The audit logs for the order
   */
  async getLogs(locationId: string, orderId: string) {
    return await this.requestMaker({
      url: `/orders/${orderId}/logs`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Append a list of Items to an order
   * @param locationId hashed location ID of the location
   * @param orderId Order ID to be updated
   * @param data updated data
   * @returns The order that was updated
   */
  async addItems(locationId: string, orderId: string, data: any) {
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
  async removeItems(locationId: string, orderId: string, data: any) {
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
  async preprocess(locationId: string, data: any) {
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
}
