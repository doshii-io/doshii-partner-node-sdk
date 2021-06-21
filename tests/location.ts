import Doshii from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
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
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all locations", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleLocationResponse] });
    await expect(doshii.location.get()).resolves.toMatchObject([
      sampleLocationResponse,
    ]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/locations",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific location", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleLocationResponse });
    await expect(doshii.location.get(locationId)).resolves.toMatchObject(
      sampleLocationResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should reject the promise if request fails", async () => {
    jest
      .spyOn(axios, "request")
      .mockRejectedValue({ status: 500, error: "failed" });
    await expect(doshii.location.get()).rejects.toBeDefined();
  });

  test("Should request for health of all locations", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleLocationHealthResponse] });
    await expect(doshii.location.getHealth()).resolves.toMatchObject([
      sampleLocationHealthResponse,
    ]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/health/locations`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for health of all locations", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleLocationHealthResponse });
    await expect(doshii.location.getHealth(locationId)).resolves.toMatchObject(
      sampleLocationHealthResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/health/locations/${locationId}`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for all terminals at location", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: [sampleLocationTerminalResponse],
    });
    await expect(
      doshii.location.getTerminal(locationId)
    ).resolves.toMatchObject([sampleLocationTerminalResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/terminals",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for all terminals at location", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleLocationTerminalResponse,
    });
    const terminalId = "terdfasdio908324";
    await expect(
      doshii.location.getTerminal(locationId, terminalId)
    ).resolves.toMatchObject(sampleLocationTerminalResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/terminals/${terminalId}`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for location subscription", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: { message: "Successfully subscribed" },
    });
    await expect(
      doshii.location.subscribeTo(locationId)
    ).resolves.toMatchObject({ message: "Successfully subscribed" });
    expect(requestSpy).toBeCalledWith({
      headers: {
        hashedLocationId: locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/subscription`,
    });

    const data = {
      mappedLocationId: "12345",
      useFilteredMenu: true,
    };
    await expect(
      doshii.location.subscribeTo(locationId, data)
    ).resolves.toMatchObject({ message: "Successfully subscribed" });
    expect(requestSpy).toBeCalledWith({
      headers: {
        hashedLocationId: locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/subscription`,
      data,
    });
  });

  test("Should request for location unsubscription", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: { message: "Successfully unsubscribed" },
    });
    await expect(
      doshii.location.unSubscribeFrom(locationId)
    ).resolves.toMatchObject({ message: "Successfully unsubscribed" });
    expect(requestSpy).toBeCalledWith({
      headers: {
        hashedLocationId: locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "DELETE",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/subscription`,
    });
  });
});
