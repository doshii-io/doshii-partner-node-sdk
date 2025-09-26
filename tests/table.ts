import Doshii, { BookingStatus, OrderStatus } from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";

import {
  sampleOrderResponse,
  sampleBookingResponses,
  sampleCheckinResponse
} from "./sharedSamples";

jest.mock("jsonwebtoken");

const sampleTableResponse = {
  name: "table1",
  maxCovers: 4,
  isActive: true,
  revenueCentre: "123",
  criteria: {
    isCommunal: true,
    canMerge: true,
    isSmoking: false,
    isOutdoor: false
  },
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/tables/table1"
};

describe("Table", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    "doshii-location-id": locationId,
    authorization: "Bearer signedJwt",
    "content-type": "application/json"
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

  test("Should request for all tables", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/tables`).reply(200, [sampleTableResponse]);

    await expect(doshii.table.getAll(locationId)).resolves.toMatchObject([
      sampleTableResponse
    ]);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should request for one table", async () => {
    const tableName = "table1";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/tables/${tableName}`).reply(200, sampleTableResponse);

    await expect(
      doshii.table.getOne(locationId, tableName)
    ).resolves.toMatchObject(sampleTableResponse);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should request for tables with options", async () => {
    const params = {
      id: ["124l", "dsf"],
      covers: "fdgsfg",
      isActive: true,
      openOrders: true,
      revenueCentre: "rev123"
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables`)
    .query({
      id: ["124l", "dsf"].join(','),
      covers: "fdgsfg",
      isActive: true,
      openOrders: true,
      revenueCentre: "rev123"
    })
    .reply(200, [sampleTableResponse]);

    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
  });

  test("Should request for tables and virtual tables", async () => {
    const params = {
      id: ["124l", "dsf"],
      covers: "fdgsfg",
      isActive: true,
      openOrders: true,
      allowVirtual: true,
      revenueCentre: "rev123"
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables`)
    .query({
      id: ["124l", "dsf"].join(','),
      covers: "fdgsfg",
      isActive: true,
      openOrders: true,
      allowVirtual: true,
      revenueCentre: "rev123"
    })
    .reply(200, [sampleTableResponse]);

    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
  });

  test("Should remove parameter allowVirtual if openOrders not true", async () => {
    const params = {
      id: ["124l", "dsf"],
      covers: "fdgsfg",
      isActive: true,
      allowVirtual: true,
      revenueCentre: "rev123"
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables`)
    .query({
      id: ["124l", "dsf"].join(','),
      covers: "fdgsfg",
      isActive: true,
      revenueCentre: "rev123"
    })
    .reply(200, [sampleTableResponse]);

    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
  });

  test("Should request for table bookings with or without filters", async () => {
    const tableName = "table1";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/${tableName}/bookings`)
    .reply(200, sampleBookingResponses);

    await expect(
      doshii.table.getBookings(locationId, tableName)
    ).resolves.toMatchObject(sampleBookingResponses);

    const filters = {
      status: BookingStatus.ACCEPTED,
      seated: false
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/${tableName}/bookings`)
    .query({
      status: BookingStatus.ACCEPTED,
      seated: false
    })
    .reply(200, sampleBookingResponses);

    await expect(
      doshii.table.getBookings(locationId, tableName, filters)
    ).resolves.toMatchObject(sampleBookingResponses);
  });

  test("Should request for table checkins", async () => {
    const tableName = "table1";
    
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/${tableName}/checkins`)
    .reply(200, [sampleCheckinResponse]);

    await expect(
      doshii.table.getCheckins(locationId, tableName)
    ).resolves.toMatchObject([sampleCheckinResponse]);
  });

  test("Should request for table orders with or without filters", async () => {
    const tableName = "table1";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/${tableName}/orders`)
    .reply(200, [sampleOrderResponse]);

    await expect(
      doshii.table.getOrders(locationId, tableName)
    ).resolves.toMatchObject([sampleOrderResponse]);

    const filters = {
      status: OrderStatus.PENDING
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/${tableName}/orders`)
    .query(filters)
    .reply(200, [sampleOrderResponse]);

    await expect(
      doshii.table.getOrders(locationId, tableName, filters)
    ).resolves.toMatchObject([sampleOrderResponse]);
  });

  test("Should retrieve a table by encoding the table name with a special character", async () => {
    const tableName = "table1/table2";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/table1%2Ftable2`)
    .reply(200, sampleTableResponse);

    await doshii.table.getOne(locationId, tableName);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should correctly format table order request to encode table name with a special character", async () => {
    const tableName = "table1/table2";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/table1%2Ftable2/orders`)
    .reply(200, [sampleOrderResponse]);

    await doshii.table.getOrders(locationId, tableName);
  });

  test("Should correctly format table checkin request to encode table name with a special character", async () => {
    const tableName = "table1/table2";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/table1%2Ftable2/checkins`)
    .reply(200, [sampleCheckinResponse]);

    await doshii.table.getCheckins(locationId, tableName);
  });

  test("Should correctly format table booking request to encode table name with a special character", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/tables/table1%2Ftable2/bookings`)
    .reply(200, sampleBookingResponses);

    const tableName = "table1/table2";
    await doshii.table.getBookings(locationId, tableName);
  });  
});
