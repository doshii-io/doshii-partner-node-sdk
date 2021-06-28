import Doshii, { DoshiiEvents } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleResponse = {
  event: "order_created",
  webhookUrl: "https://some.external.site/doshii/webhook",
  authenticationEnabled: false,
  webhookLatency: 5000,
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "http://sandbox.doshii.co/partner/v3/webhooks/order_created",
};

describe("Webhook", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all registered webhooks", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleResponse] });
    await expect(doshii.webhook.getAll()).resolves.toMatchObject([
      sampleResponse,
    ]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/webhooks",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific webhook", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleResponse });
    await expect(
      doshii.webhook.getOne(DoshiiEvents.BOOKING_CREATED)
    ).resolves.toMatchObject(sampleResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/webhooks/${DoshiiEvents.BOOKING_CREATED}`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a new webhook registration", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleResponse });
    const data = {
      event: DoshiiEvents.CHECKIN_CREATED,
      webhookUrl: "https://some.external.site/doshii/webhook",
      authenticationKey: "secure_key",
      authenticationToken: "secure_token",
    };
    await expect(doshii.webhook.registerWebhook(data)).resolves.toMatchObject(
      sampleResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/webhooks",
      data,
    });
  });

  test("Should request for a webhook update", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleResponse });
    const data = {
      event: DoshiiEvents.TABLE_DELETED,
      webhookUrl: "https://some.external.site/doshii/webhook",
      authenticationKey: "secure_key",
      authenticationToken: "secure_token",
    };
    await expect(doshii.webhook.updateWebhook(data)).resolves.toMatchObject(
      sampleResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/webhooks/${data.event}`,
      data: {
        webhookUrl: "https://some.external.site/doshii/webhook",
        authenticationKey: "secure_key",
        authenticationToken: "secure_token",
      },
    });
  });

  test("Should request for a webhook removal", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: { message: "The webhook subscription that was deleted" },
    });
    await expect(
      doshii.webhook.removeWebhook(DoshiiEvents.CHECKIN_CREATED)
    ).resolves.toMatchObject({
      message: "The webhook subscription that was deleted",
    });
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "DELETE",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/webhooks/${DoshiiEvents.CHECKIN_CREATED}`,
    });
  });
});
