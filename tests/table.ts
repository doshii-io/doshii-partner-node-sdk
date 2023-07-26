import Doshii, { BookingStatus, OrderStatus } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

import {
  sampleOrderResponse,
  sampleBookingResponses,
  sampleCheckinResponse
} from "./sharedSamples";

jest.mock("axios");
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
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all tables", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTableResponse] });
    await expect(doshii.table.getAll(locationId)).resolves.toMatchObject([
      sampleTableResponse
    ]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables"
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for one table", async () => {
    const tableName = "table1";
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleTableResponse });
    await expect(
      doshii.table.getOne(locationId, tableName)
    ).resolves.toMatchObject(sampleTableResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}`
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for tables with options", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTableResponse] });
    const params = {
      id: ["124l", "dsf"],
      covers: "fdgsfg",
      isActive: true,
      openOrders: true,
      revenueCentre: "rev123"
    };
    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables",
      params
    });
  });
  test("Should request for tables and virtual tables", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTableResponse] });
    const params = {
      id: ["124l", "dsf"],
      covers: "fdgsfg",
      isActive: true,
      openOrders: true,
      allowVirtual: true,
      revenueCentre: "rev123"
    };
    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables",
      params
    });
  });
  test("Should remove parameter allowVirtual if openOrders not true", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTableResponse] });
    const params = {
      id: ["124l", "dsf"],
      covers: "fdgsfg",
      isActive: true,
      allowVirtual: true,
      revenueCentre: "rev123"
    };
    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables",
      params: {
        id: ["124l", "dsf"],
        covers: "fdgsfg",
        isActive: true,
        revenueCentre: "rev123"
      }
    });
  });

  test("Should request for table bookings with or without filters", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleBookingResponses });
    const tableName = "table1";
    await expect(
      doshii.table.getBookings(locationId, tableName)
    ).resolves.toMatchObject(sampleBookingResponses);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/bookings`
    });

    const filters = {
      status: BookingStatus.ACCEPTED,
      seated: false
    };
    await expect(
      doshii.table.getBookings(locationId, tableName, filters)
    ).resolves.toMatchObject(sampleBookingResponses);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/bookings`,
      params: filters
    });
  });

  test("Should request for table checkins", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleCheckinResponse] });
    const tableName = "table1";
    await expect(
      doshii.table.getCheckins(locationId, tableName)
    ).resolves.toMatchObject([sampleCheckinResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/checkins`
    });
  });

  test("Should request for table orders with or without filters", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleOrderResponse] });
    const tableName = "table1";
    await expect(
      doshii.table.getOrders(locationId, tableName)
    ).resolves.toMatchObject([sampleOrderResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/orders`
    });

    const filters = {
      status: OrderStatus.PENDING
    };
    await expect(
      doshii.table.getOrders(locationId, tableName, filters)
    ).resolves.toMatchObject([sampleOrderResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json"
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/orders`,
      params: filters
    });
  });

  test("Should retrieve a table by encoding the table name with a special character", async () => {
    const tableName = "table1/table2";
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleTableResponse });
    await doshii.table.getOne(locationId, tableName);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables/table1%2Ftable2",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should correctly format table order request to encode table name with a special character", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleOrderResponse] });
    const tableName = "table1/table2";
    await doshii.table.getOrders(locationId, tableName);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables/table1%2Ftable2/orders",
    });
  });

  test("Should correctly format table checkin request to encode table name with a special character", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleCheckinResponse] });
    const tableName = "table1/table2";
    await doshii.table.getCheckins(locationId, tableName);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables/table1%2Ftable2/checkins",
    });
  });

  test("Should correctly format table booking request to encode table name with a special character", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleBookingResponses });
    const tableName = "table1/table2";
    await doshii.table.getBookings(locationId, tableName);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables/table1%2Ftable2/bookings",
    });
  });  
});
