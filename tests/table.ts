import Doshii, { BookingStatus, OrderStatus } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

import {
  sampleOrderResponse,
  sampleBookingResponses,
  sampleCheckinResponse,
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
    isOutdoor: false,
  },
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/tables/table1",
};

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all tables", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTableResponse] });
    await expect(doshii.table.getAll(locationId)).resolves.toMatchObject([
      sampleTableResponse,
    ]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables",
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
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}`,
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
    };
    await expect(
      doshii.table.getAll(locationId, params)
    ).resolves.toMatchObject([sampleTableResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables",
      params,
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
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/bookings`,
    });

    await expect(
      doshii.table.getBookings(locationId, tableName, {
        status: BookingStatus.ACCEPTED,
        seated: false,
      })
    ).resolves.toMatchObject(sampleBookingResponses);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/bookings`,
      params: {
        status: BookingStatus.ACCEPTED,
        seated: false,
      },
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
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/checkins`,
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
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/orders`,
    });

    await expect(
      doshii.table.getOrders(locationId, tableName, {
        status: OrderStatus.PENDING,
      })
    ).resolves.toMatchObject([sampleOrderResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/tables/${tableName}/orders`,
      params: {
        status: "pending",
      },
    });
  });
});
