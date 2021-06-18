import Doshii from "../lib/doshii";
import { WebhookEvents } from "../lib/webhook";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Webhook", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;
  let requestSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
    requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: "success" });
  });

  test("Should request for registered webhooks", async () => {
    await expect(doshii.webhook.get()).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/webhooks",
    });

    await expect(
      doshii.webhook.get(WebhookEvents.BOOKING_CREATED)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/webhooks/${WebhookEvents.BOOKING_CREATED}`,
    });
    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for a new webhook registration", async () => {
    const data = { webhook: "new webhook" };
    await expect(
      doshii.webhook.registerWebhook(WebhookEvents.CHECKIN_CREATED, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/webhooks",
      data: {
        ...data,
        event: WebhookEvents.CHECKIN_CREATED,
      },
    });
  });

  test("Should request for a webhook update", async () => {
    const data = { webhook: "webhook update" };
    await expect(
      doshii.webhook.updateWebhook(WebhookEvents.CHECKIN_CREATED, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/webhooks/${WebhookEvents.CHECKIN_CREATED}`,
      data,
    });
  });

  test("Should request for a webhook removal", async () => {
    await expect(
      doshii.webhook.removeWebhook(WebhookEvents.CHECKIN_CREATED)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "DELETE",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/webhooks/${WebhookEvents.CHECKIN_CREATED}`,
    });
  });
});
