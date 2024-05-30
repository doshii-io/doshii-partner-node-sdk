import Doshii, { DataAggregationRequest, LocationClasses } from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Bulk data", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    "X-API-KEY": "11aa1c69c46934d880ee8f9d42579bf4430a20a240e5628a0f2ebebb1776257e:someAppId",
    authorization: "Bearer signedJwt",
    "content-type": "application/json",
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

  test("Should submit a data aggregation request", async () => {
    const data: DataAggregationRequest = {
      doshiiId: "rj7DnGBL",
      webhook: {
        url: "https://my.service.com/webhooks/data",
        headers: {},
      },
      mimeType: "application/json",
      fileSize: 10000,
      classifiers: [LocationClasses.BAKERY, LocationClasses.CAFE],
      locations: ["4gJpXq9B"],
      sortBy: {
        property: "created",
        method: "ASC",
      },
      range: {
        start: new Date(Date.UTC(2020, 11, 1)),
        end: new Date(Date.UTC(2021, 1, 1)),
      },
    };

    const sampleResponse = {
      requestId: "e1182944-3b97-4ac3-9839-d1a7b56c2c79",
      requestCreatedAt: 1542628078,
      status: "pending",
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).post('/partner/v3/data/orders', _.matches({
          doshiiId: "rj7DnGBL",
          webhook: {
            url: "https://my.service.com/webhooks/data",
            headers: {},
          },
          mimeType: "application/json",
          fileSize: 10000,
          classifiers: [LocationClasses.BAKERY, LocationClasses.CAFE],
          locations: ["4gJpXq9B"],
          sortBy: {
            property: "created",
            method: "ASC",
          },
          range: {
            start: 1606780800,
            end: 1612137600,
          },
        })).reply(200, sampleResponse);

    await expect(
      doshii.requestBulkDataAggregation("orders", data, "someAppId")
    ).resolves.toMatchObject(sampleResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for the status for previously submitted data aggregation request", async () => {
    // instantiate doshi with appId so that we dont have to pass that in the request function call
    doshii = new Doshii(clientId, clientSecret, {
      appId: "someAppId",
      sandbox: true,
    });
    const sampleResponse = {
      requestId: "someRequestId",
      requestCreatedAt: 1542628078,
      requestCompletedAt: 1542628078,
      status: "pending",
      files: {
        uri: "/we23XDs1/e1182944-3b97-4ac3-9839-d1a7b56c2c79/fileName.json.gzip",
        size: 10002,
        expires: 1542933823,
      },
      tally: {
        locations: 350,
        orders: 700,
        transactions: 920,
        amount: 1520000,
      },
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get('/partner/v3/data/orders/someRequestId').reply(200, sampleResponse);

    await expect(
      doshii.getBulkDataAggregationStatus("someRequestId", "orders")
    ).resolves.toMatchObject(sampleResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });
});
