import { AxiosRequestConfig } from "axios";
import { Surcount } from "./sharedSchema";

type PaymentMethod =
  | "cash"
  | "visa"
  | "mastercard"
  | "eftpos"
  | "amex"
  | "diners"
  | "giftcard"
  | "loyalty"
  | "credit"
  | "crypto"
  | "directdeposit"
  | "cheque"
  | "alipay"
  | "wechatpay"
  | "zip"
  | "moto"
  | "other";

export interface TransactionRequest {
  amount: number;
  reference: string;
  invoice?: string;
  linkedTrxId?: string;
  method: PaymentMethod;
  tip?: number;
  trn?: string;
  prepaid: boolean;
  surcounts?: Array<Surcount>;
}

export interface TransactionUpdate {
  amount?: number;
  reference?: string;
  invoice?: string;
  method?: PaymentMethod;
  tip?: number;
  trn?: string;
  prepaid?: boolean;
  surcounts?: Array<Surcount>;
  version: string;
  status:
    | "requested"
    | "pending"
    | "waiting"
    | "cancelled"
    | "rejected"
    | "complete";
  rejectionCode?: "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7" | "POSISE";
  rejectionReason?: string;
  verifyData?: {
    requires: Array<
      | "accountId"
      | "issueDate"
      | "expiryDate"
      | "authorisationCode"
      | "imageUri"
    >;
    accountId?: string;
    issueDate?: string;
    expiryDate?: string;
    authorisationCode?: string;
    imageUri?: string;
  };
}

export interface TransactionResponse {
  amount: number;
  reference: string;
  invoice: string;
  linkedTrxId: string;
  method: PaymentMethod;
  tip: number;
  trn: string;
  surcount: Array<Surcount>;
  id: string;
  orderId: string;
  acceptLess: boolean;
  partnerInitiated: boolean;
  prepaid: boolean;
  rejectionCode: "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7" | "POSISE";
  rejectionReason: string;
  version: string;
  updatedAt: string;
  createdAt: string;
  uri: string;
  status:
    | "requested"
    | "pending"
    | "waiting"
    | "cancelled"
    | "rejected"
    | "complete";
  createdByApp: string;
  processedByApp: string;
  posTerminalId: string;
  requestedAppId: string;
}

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
  async getOrderTransactions(
    locationId: string,
    orderId: string
  ): Promise<Array<TransactionResponse>> {
    return await this.requestMaker({
      url: `/orders/${orderId}/transactions`,
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
  async getTransaction(
    locationId: string,
    transactionId: string
  ): Promise<TransactionResponse> {
    return await this.requestMaker({
      url: `/transactions/${transactionId}`,
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
  async createTransaction(
    locationId: string,
    orderId: string,
    data: TransactionRequest
  ): Promise<TransactionResponse> {
    return await this.requestMaker({
      url: `/orders/${orderId}/transactions`,
      method: "POST",
      headers: {
        "doshii-location-id": locationId,
      },
      data,
    });
  }

  // /**
  //  * Alternate method for creating a new Transaction by specifying the Order ID in the request body
  //  * @param locationId The hashed Location ID of the location you are interacting with
  //  * @param data transaction data
  //  * @returns
  //  */
  // async createTransaction(locationId: string, data: any) {
  //   return await this.requestMaker({
  //     url: `/transactions`,
  //     method: "POST",
  //     headers: {
  //       "doshii-location-id": locationId,
  //     },
  //     data,
  //   });
  // }

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
    data: TransactionUpdate
  ): Promise<TransactionResponse> {
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
