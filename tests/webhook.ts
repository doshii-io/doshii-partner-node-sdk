import Doshii, { DoshiiEvents } from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";

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
  const locationId = 'someid'
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    authorization: "Bearer signedJwt",
    "content-type": "application/json",
  };
  const REQUEST_HEADERS_WITH_LOCATION = {
    authorization: "Bearer signedJwt",
    "content-type": "application/json",
    "doshii-location-id": locationId
  };

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  afterEach(() => {
    nock.isDone();
    nock.cleanAll();
  });

  test("Should request for all registered webhooks", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/webhooks`).reply(200, [sampleResponse]);

    await expect(doshii.webhook.getAll()).resolves.toMatchObject([
      sampleResponse,
    ]);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific webhook location", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    }).get(`/partner/v3/webhooks`).reply(200, sampleResponse);

    await expect(
      doshii.webhook.getFromLocation(locationId)
    ).resolves.toMatchObject(sampleResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific webhook", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/webhooks/${DoshiiEvents.BOOKING_CREATED}`).reply(200, sampleResponse);

    await expect(
      doshii.webhook.getOne(DoshiiEvents.BOOKING_CREATED)
    ).resolves.toMatchObject(sampleResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a new webhook registration", async () => {
    const data = {
      event: DoshiiEvents.CHECKIN_CREATED,
      webhookUrl: "https://some.external.site/doshii/webhook",
      authenticationKey: "secure_key",
      authenticationToken: "secure_token",
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    }).post(`/partner/v3/webhooks`, _.matches(data)).reply(200, sampleResponse);

    await expect(doshii.webhook.registerWebhook(data, locationId)).resolves.toMatchObject(
      sampleResponse
    );
  });

  test("Should request for a webhook update", async () => {
    const data = {
      event: DoshiiEvents.TABLE_DELETED,
      webhookUrl: "https://some.external.site/doshii/webhook",
      authenticationKey: "secure_key",
      authenticationToken: "secure_token",
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/webhooks/${data.event}`, _.matches({
      webhookUrl: "https://some.external.site/doshii/webhook",
      authenticationKey: "secure_key",
      authenticationToken: "secure_token",
    })).reply(200, sampleResponse);

    await expect(doshii.webhook.updateWebhook(data)).resolves.toMatchObject(
      sampleResponse
    );
  });

  test("Should request for a webhook removal", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    }).delete(`/partner/v3/webhooks/${DoshiiEvents.CHECKIN_CREATED}`).reply(200, { message: "The webhook subscription that was deleted" });

    await expect(
      doshii.webhook.removeWebhook(DoshiiEvents.CHECKIN_CREATED, locationId)
    ).resolves.toMatchObject({
      message: "The webhook subscription that was deleted",
    });
  });
});
