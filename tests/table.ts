import Doshii from "../lib/doshii";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
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

  test("Should request for tables", async () => {
    await expect(doshii.table.get(locationId)).resolves.toBeDefined();
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

    const tableName = "sonsf90385";
    await expect(
      doshii.table.get(locationId, tableName, {
        id: ["124l", "dsf"],
        covers: "fdgsfg",
        isActive: true,
      })
    ).resolves.toBeDefined();
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
    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for tables with options", async () => {
    await expect(
      doshii.table.get(locationId, "", {
        id: ["124l", "dsf"],
        covers: "fdgsfg",
        isActive: true,
      })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/tables",
      params: {
        id: ["124l", "dsf"],
        covers: "fdgsfg",
        isActive: true,
      },
    });
  });

  test("Should request for table bookings with or without filters", async () => {
    const tableName = "table1";
    await expect(
      doshii.table.getBookings(locationId, tableName)
    ).resolves.toBeDefined();
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
        status: "pending",
        seated: false,
      })
    ).resolves.toBeDefined();
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
        status: "pending",
        seated: false,
      },
    });
  });

  test("Should request for table checkins", async () => {
    const tableName = "table1";
    await expect(
      doshii.table.getCheckins(locationId, tableName)
    ).resolves.toBeDefined();
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
    const tableName = "table1";
    await expect(
      doshii.table.getOrders(locationId, tableName)
    ).resolves.toBeDefined();
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
        status: "pending",
      })
    ).resolves.toBeDefined();
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
