import { AxiosRequestConfig } from "axios";

export enum DoshiiEvents {
  ORDER_CREATED = "order_created",
  ORDER_PREPROCESSED = "order_preprocess",
  ORDER_UPDATED = "order_updated",
  EMPLOYEE_CREATED = "employee_created",
  EMPLOYEE_UPDATED = "employee_updated",
  EMPLOYEE_DELETED = "employee_deleted",
  TRANSACTION_CREATED = "transaction_created",
  TRANSACTION_UPDATED = "transaction_updated",
  REWARD_REDEEMED = "reward_redemption",
  POINTS_REDEEMED = "points_redemption",
  MENU_UPDATED = "menu_updated",
  MEMBER_CREATED = "member_created",
  MEMBER_DELETED = "member_deleted",
  MEMBER_UPDATED = "member_updated",
  TABLE_CREATED = "table_created",
  TABLE_UPDATED = "table_updated",
  TABLE_DELETED = "table_deleted",
  TABLE_BULK_UPDATED = "table_bulk_updated",
  BOOKING_CREATED = "booking_created",
  BOOKING_UPDATED = "booking_updated",
  CHECKIN_CREATED = "checkin_created",
  CHECKIN_DELETED = "checkin_deleted",
  CHECKIN_UPDATED = "checkin_updated",
  RESOURCE_CREATED = "resource_created",
  RESOURCE_UPDATED = "resource_updated",
  RESOURCE_DELETED = "resource_deleted",
  CARD_ACTIVATION_REQUESTED = "card_activate",
  CARD_ENQUIRY_REQUESTED = "card_enquiry",
  APP_MENU_UPDATED = "app_menu_updated",
  APP_MENU_ITEM_UPDATED = "app_menu_item_updated",
  LOCATION_SUBSCRIPTION = "location_subscription",
  LOCATION_HOURS_UPDATED = "location_hours_updated",
  LOYALTY_CHECKIN_CREATED = "loyalty_checkin_created",
  LOYALTY_CHECKIN_UPDATED = "loyalty_checkin_updated",
  LOYALTY_CHECkIN_DELETED = "loyalty_checkin_deleted",
}

export interface WebhookRegister {
  event: DoshiiEvents;
  webhookUrl: string;
  authenticationKey?: string;
  authenticationToken?: string;
}

export interface WebhookResponse {
  event: DoshiiEvents;
  webhookUrl: string;
  webhookLatency?: number;
  authenticationEnabled: boolean;
  updatedAt: string;
  createdAt: string;
  uri: string;
  locationId?: string;
}
/**
 * Webhooks API
 */
export default class Webhook {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve webhooks registered for your application from specific location
   * @param locationId hashed location ID of the location
   */

  async getFromLocation(
    locationId: string
  ): Promise<Array<WebhookResponse> | WebhookResponse> {
    return await this.requestMaker({
      headers: {
        "doshii-location-id": locationId,
      },
      url: "/webhooks",
      method: "GET",
    });
  }

  /**
   * Retrieve webhooks registered for your application
   * @param event The name of the Doshii event that the webhook subscription is being retrieved for.
   * If not provided all the registered webhooks are retrieved
   * @returns a list of webhooks or just once webhook if event is provided
   */
  private async get(
    event?: DoshiiEvents
  ): Promise<Array<WebhookResponse> | WebhookResponse> {
    return await this.requestMaker({
      url: event ? `/webhooks/${event}` : "/webhooks",
      method: "GET",
    });
  }

  /**
   * Retrieve a specific webhook registered for your application
   * @returns a list of webhooks
   */
  async getAll(): Promise<Array<WebhookResponse>> {
    return this.get() as Promise<Array<WebhookResponse>>;
  }

  /**
   * Retrieve a specific webhook registered for your application
   * @param event The name of the Doshii event that the webhook subscription is being retrieved for.
   * @returns webhook for the provided event
   */
  async getOne(event: DoshiiEvents): Promise<WebhookResponse> {
    return this.get(event) as Promise<WebhookResponse>;
  }

  /**
   * Register a webhook for your application
   * @param event The name of the Doshii event that the webhook subscription is being retrieved for.
   * @param data The details for the new webhook
   * @returns the registered webhook
   *
   */
  async registerWebhook(data: WebhookRegister, locationId?: string): Promise<WebhookResponse> {
    return await this.requestMaker({
      ...(locationId && {
        headers: {
           "doshii-location-id": locationId,
        },
     }),
      url: "/webhooks",
      method: "POST",
      data,
    });
  }

  /**
   * Update the details of a device registered to your application
   * @param data The details for the webhook
   * @returns The updated webhook
   */
  async updateWebhook(data: WebhookRegister): Promise<WebhookResponse> {
    return await this.requestMaker({
      url: `/webhooks/${data.event}`,
      method: "PUT",
      data: {
        webhookUrl: data.webhookUrl,
        authenticationKey: data.authenticationKey,
        authenticationToken: data.authenticationToken,
      },
    });
  }

  /**
   * Remove a webhook subscription from your application
   * @param event The name of the Doshii event that the webhook subscription is being removed from.
   * @returns status of the operation
   */
  async unregisterWebhook(event: DoshiiEvents, locationId?: string): Promise<{ message: string }> {
    return await this.requestMaker({
      ...(locationId && {
        headers: {
           "doshii-location-id": locationId,
        },
     }),
      url: `/webhooks/${event}`,
      method: "DELETE",
    });
  }

  deleteWebhook = this.unregisterWebhook;
  removeWebhook = this.unregisterWebhook;
}
