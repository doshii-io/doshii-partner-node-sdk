import Doshii from "../lib";
import jwt from "jsonwebtoken";
import nock from "nock";
import _ from "lodash";
import {
  sampleCheckinRequest,
  sampleCheckinResponse,
  sampleOrderResponse,
} from "./sharedSamples";

jest.mock("jsonwebtoken");

describe("Check in", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const checkinId = "chekc34idje9";
  const clientSecret = "su234perDu[erse-898cret-09";
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    "doshii-location-id": locationId,
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

  test("Should request for all checkins", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/checkins`).reply(200, [sampleCheckinResponse]);

    await expect(doshii.checkin.getAll(locationId)).resolves.toMatchObject([
      sampleCheckinResponse,
    ]);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific checkin", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/checkins/${checkinId}`).reply(200, sampleCheckinResponse);

    await expect(
      doshii.checkin.getOne(locationId, checkinId)
    ).resolves.toMatchObject(sampleCheckinResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should pass on the filters as params for retrieving checkins", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/checkins`)
    .query({
      from: 1609459200,
      to: 1609545600,
      limit: 100,
      offset: 2,
      updatedFrom: 1609459200,
      updatedTo: 1609545600,
    })
    .reply(200, [sampleCheckinResponse]);

    await expect(
      doshii.checkin.getAll(locationId, {
        from: new Date(Date.UTC(2021, 0, 1)),
        to: new Date(Date.UTC(2021, 0, 2)),
        updatedFrom: new Date(Date.UTC(2021, 0, 1)),
        updatedTo: new Date(Date.UTC(2021, 0, 2)),
        offset: 2,
        limit: 100,
      })
    ).resolves.toMatchObject([sampleCheckinResponse]);
  });

  test("Should reject the promise if request fails", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(() => true).reply(500);

    await expect(doshii.checkin.getAll(locationId)).rejects.toBeDefined();
    await expect(doshii.checkin.getOne(locationId, checkinId)).rejects.toBeDefined();
  });

  test("Should request for checkin orders", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/checkins/${checkinId}/orders`)
    .reply(200, [sampleOrderResponse]);

    await expect(
      doshii.checkin.getOrders(locationId, checkinId)
    ).resolves.toMatchObject([sampleOrderResponse]);
  });

  test("Should request new checkin", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .post(`/partner/v3/checkins`)
    .reply(200, sampleCheckinResponse);

    await expect(
      doshii.checkin.create(locationId, sampleCheckinRequest)
    ).resolves.toMatchObject(sampleCheckinResponse);
  });

  test("Should request for checkin update", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/checkins/${checkinId}`, _.matches(sampleCheckinRequest))
    .reply(200, sampleCheckinResponse);

    await expect(
      doshii.checkin.update(locationId, checkinId, sampleCheckinRequest)
    ).resolves.toBeDefined();
  });
});
