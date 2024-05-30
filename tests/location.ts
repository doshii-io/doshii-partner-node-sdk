import Doshii from "../lib";
import jwt from "jsonwebtoken";
import nock from "nock";
import _ from "lodash";

jest.mock("jsonwebtoken");

const sampleLocationResponse = {
  id: "2X3b8q",
  name: "Chicken's R Us",
  addressLine1: "520 Bourke St",
  addressLine2: "Level 1",
  city: "Melbourne",
  state: "VIC",
  country: "AU",
  postalCode: "3000",
  latitude: 34.4,
  longitude: 157.5,
  timezone: "Australia/Melbourne",
  phoneNumber: "+61415123456",
  email: "info@therestaurant.org",
  publicWebsiteUrl: "https://therestaurant.com.au",
  mappedLocationId: "12345",
  classification: "Accommodation",
  vendor: "1",
  organisationId: "5X3b8n",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/location/2X3b8q",
  operatingHours: [
    {
      standard: true,
      status: "open",
      dates: [
        {
          day: 31,
          month: 1,
          year: 2019,
        },
      ],
      time: {
        from: "13:00",
        to: "23:00",
      },
      daysOfWeek: ["mon", "tue"],
      effective: {
        from: "string",
        to: "string",
      },
    },
  ],
  capability: {
    healthCheck: "supported",
    orderPreProcess: "supported",
  },
  imageUri: "http://doshii.io/logo.png",
};

const sampleLocationHealthResponse = {
  locationId: "2X3b8q",
  name: "Chicken's R Us",
  communicationType: "websockets",
  heartbeat: "2019-01-01T12:00:00.000Z",
  status: "active",
  trading: true,
  locationTime: "2019-07-25T10:57:43+10:00",
  prepTimes: {
    dinein: 10,
    pickup: 15,
    delivery: 20,
  },
  locationUri: "https://sandbox.doshii.co/partner/v3/locations/2X3b8q",
};

const sampleLocationTerminalResponse = {
  doshiiId: "bEK3ryO7",
  name: "bar1",
  ref: "1235",
  area: "bar",
  description: "Terminal at end of bar",
  locationId: "4gJpXq9B",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/terminals/bEK3ryO7",
};

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    authorization: "Bearer signedJwt",
    "content-type": "application/json",
  };
  const REQUEST_HEADERS_WITH_LOCATION = {
    "doshii-location-id": locationId,
    authorization: "Bearer signedJwt",
    "content-type": "application/json",
  };
  const REQUEST_HEADERS_WITH_HASHED_LOCATION = {
    hashedLocationId: locationId,
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

  test("Should request for all locations", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/locations`).reply(200, [sampleLocationResponse]);

    await expect(doshii.location.getAll()).resolves.toMatchObject([
      sampleLocationResponse,
    ]);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific location", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    }).get(`/partner/v3/locations/${locationId}`).reply(200, sampleLocationResponse);

    await expect(doshii.location.getOne(locationId)).resolves.toMatchObject(
      sampleLocationResponse
    );

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should reject the promise if request fails", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(() => true).reply(500);
    await expect(doshii.location.getAll()).rejects.toBeDefined();
    await expect(doshii.location.getOne(locationId)).rejects.toBeDefined();
  });

  test("Should request for health of all locations with and without filters", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/health/locations`)
    .reply(200, [sampleLocationHealthResponse]);

    await expect(doshii.location.getHealth()).resolves.toMatchObject([
      sampleLocationHealthResponse,
    ]);

    // with filters
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/health/locations`)
    .query({
      since: 1609459200,
      inverse: false,
      sort: "asc",
    })
    .reply(200, [sampleLocationHealthResponse]);

    await expect(
      doshii.location.getAllHealths({
        since: new Date(Date.UTC(2021, 0, 1)),
        inverse: false,
        sort: "asc",
      })
    ).resolves.toMatchObject([sampleLocationHealthResponse]);

    expect(jwt.sign).toBeCalledTimes(2);
  });

  test("Should request for health of one specific location", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    })
    .get(`/partner/v3/health/locations/${locationId}`)
    .reply(200, sampleLocationHealthResponse);

    await expect(
      doshii.location.getOneHealth(locationId)
    ).resolves.toMatchObject(sampleLocationHealthResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for all terminals at location", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    })
    .get(`/partner/v3/terminals`)
    .reply(200, [sampleLocationTerminalResponse]);

    await expect(
      doshii.location.getAllTerminals(locationId)
    ).resolves.toMatchObject([sampleLocationTerminalResponse]);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for one specific terminal at location", async () => {
    const terminalId = "terdfasdio908324";
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_LOCATION,
    })
    .get(`/partner/v3/terminals/${terminalId}`)
    .reply(200, sampleLocationTerminalResponse);

    await expect(
      doshii.location.getOneTerminal(locationId, terminalId)
    ).resolves.toMatchObject(sampleLocationTerminalResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for location subscription", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_HASHED_LOCATION,
    })
    .post(`/partner/v3/locations/${locationId}/subscription`)
    .reply(200, { message: "Successfully subscribed" });

    await expect(
      doshii.location.subscribeTo(locationId)
    ).resolves.toMatchObject({ message: "Successfully subscribed" });

    const data = {
      mappedLocationId: "12345",
      useFilteredMenu: true,
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_HASHED_LOCATION,
    })
    .post(`/partner/v3/locations/${locationId}/subscription`, _.matches(data))
    .reply(200, { message: "Successfully subscribed" });

    await expect(
      doshii.location.subscribeTo(locationId, data)
    ).resolves.toMatchObject({ message: "Successfully subscribed" });
  });

  test("Should request for location unsubscription", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS_WITH_HASHED_LOCATION,
    })
    .delete(`/partner/v3/locations/${locationId}/subscription`)
    .reply(200, { message: "Successfully unsubscribed" });

    await expect(
      doshii.location.unSubscribeFrom(locationId)
    ).resolves.toMatchObject({ message: "Successfully unsubscribed" });
  });
});
