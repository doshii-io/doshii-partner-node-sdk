import Doshii from "../lib";
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

  test("Should request for menu with or without options", async () => {
    await expect(doshii.menu.get(locationId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu`,
    });

    await expect(
      doshii.menu.get(locationId, {
        lastVersion: "v2",
        filtered: true,
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
      url: `/locations/${locationId}/menu`,
      params: {
        lastVersion: "v2",
        filtered: true,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for products with or without options", async () => {
    const posId = "345sd";
    await expect(
      doshii.menu.getProducts(locationId, posId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/products/${posId}`,
    });

    await expect(
      doshii.menu.getProducts(locationId, posId, {
        filtered: false,
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
      url: `/locations/${locationId}/menu/products/${posId}`,
      params: {
        filtered: false,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for products options with or without filters", async () => {
    const posId = "345sd";
    await expect(
      doshii.menu.getProductOptions(locationId, posId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/options/${posId}`,
    });

    await expect(
      doshii.menu.getProductOptions(locationId, posId, {
        filtered: false,
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
      url: `/locations/${locationId}/menu/options/${posId}`,
      params: {
        filtered: false,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for surcounts with or without filters", async () => {
    const posId = "345sd";
    await expect(
      doshii.menu.getSurcounts(locationId, posId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/surcounts/${posId}`,
    });

    await expect(
      doshii.menu.getSurcounts(locationId, posId, {
        filtered: false,
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
      url: `/locations/${locationId}/menu/surcounts/${posId}`,
      params: {
        filtered: false,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });
});
