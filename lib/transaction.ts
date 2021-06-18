import { AxiosRequestConfig } from "axios";

export default class Transaction {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve a list of transactions associated to an Order by the Order ID
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param orderId ID of the order whose transactions are to be retrieved
   * @returns Transactions associated to the order
   */
  async getOrderTransactions(locationId: string, orderId?: string) {
    return await this.requestMaker({
      url: orderId ? `/transactions/${orderId}` : "/transactions",
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   *
   * Retrieve a single transaction by its ID
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param transactionId ID of the transaction to be retrieved
   * @returns The transaction
   */
  async getTransaction(locationId: string, transactionId: string) {
    return await this.requestMaker({
      url: `/transactions/${transactionId}`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Retrieve a list of logs for a Transaction
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param transactionId ID of the transaction to be retrieved
   * @returns audit logs for the transaction
   */
  async getLogs(locationId: string, transactionId: string) {
    return await this.requestMaker({
      url: `/transactions/${transactionId}/logs`,
      method: "GET",
      headers: {
        "doshii-location-id": locationId,
      },
    });
  }

  /**
   * Create a new Transaction against an Order
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param orderId ID of the order to add this transaction
   * @param data transaction data
   * @returns The transaction that was created
   */
  async createOrderTransaction(locationId: string, orderId: string, data: any) {
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
   * Alternate method for creating a new Transaction by specifying the Order ID in the request body
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param data transaction data
   * @returns
   */
  async createTransaction(locationId: string, data: any) {
    return await this.requestMaker({
      url: `/transactions`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  /**
   * Update the status of a Transaction
   * @param locationId The hashed Location ID of the location you are interacting with
   * @param transactionId ID of the transaction to update
   * @param data transaction data
   * @returns
   */
  async updateTransaction(
    locationId: string,
    transactionId: string,
    data: any
  ) {
    return await this.requestMaker({
      url: `/transactions/${transactionId}`,
      method: "PUT",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }
}
