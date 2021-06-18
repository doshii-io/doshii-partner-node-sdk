import Doshii from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Device", () => {
  let doshii: Doshii;
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

  test("Should request for devices in a location", async () => {
    await expect(doshii.device.get()).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "GET",
      url: "/devices",
    });

    const deviceId = "some0Location5Id9";
    await expect(doshii.device.get(deviceId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "GET",
      url: `/devices/${deviceId}`,
    });
    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for a new device creation", async () => {
    await expect(
      doshii.device.registerDevice({ device: "test device" })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: { device: "test device" },
      method: "POST",
      url: `/devices`,
    });
  });

  test("Should request for device update", async () => {
    const deviceId = "some0Booking5Id345";
    await expect(
      doshii.device.updateDevice(deviceId, { device: "update device" })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: { device: "update device" },
      method: "PUT",
      url: `/devices/${deviceId}`,
    });
  });

  test("Should requset for device removal", async () => {
    const deviceId = "some0Booking5Id345";
    await expect(
      doshii.device.unregisterDevice(deviceId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "DELETE",
      url: `/devices/${deviceId}`,
    });
  });

  test("Should reject the promise if request fails", async () => {
    jest
      .spyOn(axios, "request")
      .mockRejectedValue({ status: 500, error: "failed" });
    await expect(doshii.device.get()).rejects.toBeDefined();
  });
});
