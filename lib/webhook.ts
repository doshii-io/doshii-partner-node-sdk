import { AxiosRequestConfig } from "axios";

export enum WebhookEvents {
  ORDER_CREATED = "order_created",
  ORDER_PREPROCESSED = "order_preprocess",
  ORDER_UPDATED = "order_updated",
  EMPLOYEE_CREATED = "employee_created",
  EMPLOYEE_UPDATED = "employee_updated",
  EMPLOYEE_DELETED = "employee_deleted",
  TRANSACTION_CREATED = "transaction_created",
  TRANSACTION_UPDATED = "tracsaction_updated",
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
  BOOKING_CREATED = "bookin_created",
  BOOKING_UPDATED = "booking_updated",
  CHECKIN_CREATED = "checkin_created",
  CHECKIN_DELETED = "checkin_deleted",
  CHECKIN_UPDATED = "checkin_updated",
  RESOURCE_CREATED = "resource_created",
  RESOURCE_UPDATED = "resource_updated",
  RESOURCE_DELETED = "resource_deleted",
  CARD_ACTIVATION_REQUESTED = "card_activate",
  CARD_ENQUIRY_REQUESTED = "card_enquiry",
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
   * Retrieve webhooks registered for your application
   * @param event The name of the Doshii event that the webhook subscription is being retrieved for.
   * If not provided all the registered webhooks are retrieved
   * @returns a list of webhooks or just once webhook if event is provided
   */
  async get(event?: WebhookEvents) {
    let url = "/webhooks";
    if (event) {
      url += `/${event}`;
    }
    return await this.requestMaker({
      url,
      method: "GET",
    });
  }

  /**
   * Register a webhook for your application
   * @param event The name of the Doshii event that the webhook subscription is being retrieved for.
   * @param data The details for the new webhook
   * @returns the registered webhook
   *
   */
  async registerWebhook(event: WebhookEvents, data: any) {
    return await this.requestMaker({
      url: "/webhooks",
      method: "POST",
      data: {
        ...data,
        event,
      },
    });
  }

  /**
   * Update the details of a device registered to your application
   * @param data The details for the webhook
   * @returns The updated webhook
   */
  async updateWebhook(data: any) {
    return await this.requestMaker({
      url: "/webhooks",
      method: "PUT",
      data,
    });
  }

  /**
   * Remove a webhook subscription from your application
   * @param event The name of the Doshii event that the webhook subscription is being removed from.
   * @returns status code of the operation
   */
  async unregisterWebhook(event: WebhookEvents) {
    return await this.requestMaker({
      url: `/webhooks/${event}`,
      method: "DELETE",
    });
  }

  deleteWebhook = this.unregisterWebhook;
  removeWebhook = this.unregisterWebhook;
}
