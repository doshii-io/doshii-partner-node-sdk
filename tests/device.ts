import Doshii, { DoshiiEvents, DeviceRegister, DeviceUpdate } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleResponse = {
  doshiiId: "rj7DnGBL",
  name: "Device 1",
  ref: "24533-2345d-234f32-sdf21",
  events: "order_created",
  terminals: "bEK3ryO7",
  channels: "Order ahead",
  locationIds: "4gJpXq9B",
  version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
};

const sampleRegisterDeviceResponse = {
  name: "Device 1",
  ref: "24533-2345d-234f32-sdf21",
  events: "order_created",
  terminals: "bEK3ryO7",
  channels: "Order ahead",
  locationIds: "4gJpXq9B",
};

const sampleUpdateDeviceResponse = {
  doshiiId: "rj7DnGBL",
  name: "Device 1",
  ref: "24533-2345d-234f32-sdf21",
  events: "order_created",
  terminals: "bEK3ryO7",
  channels: "Order ahead",
  locationIds: "4gJpXq9B",
  version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
};

describe("Device", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all devices in a location", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleResponse] });
    await expect(doshii.device.get()).resolves.toMatchObject([sampleResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "GET",
      url: "/devices",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific device in a location", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleResponse });
    const deviceId = "some0Location5Id9";
    await expect(doshii.device.get(deviceId)).resolves.toMatchObject(
      sampleResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "GET",
      url: `/devices/${deviceId}`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a new device registration", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleRegisterDeviceResponse });
    const data: DeviceRegister = {
      name: "test device",
      ref: "345klwejfskle",
      events: [DoshiiEvents.ORDER_CREATED],
      terminals: ["34rwerf"],
      channels: ["Pay@Table"],
      locationIds: ["2345ert"],
    };
    await expect(doshii.device.registerDevice(data)).resolves.toMatchObject(
      sampleRegisterDeviceResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data,
      method: "POST",
      url: `/devices`,
    });
  });

  test("Should request for device update", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleUpdateDeviceResponse });
    const deviceId = "some0Booking5Id345";
    const data: DeviceUpdate = {
      name: "test device",
      ref: "345klwejfskle",
      events: [DoshiiEvents.ORDER_CREATED],
      terminals: ["34rwerf"],
      channels: ["Pay@Table"],
      locationIds: ["2345ert"],
      doshiiId: "345345",
      version: "43fsdt34t",
    };
    await expect(
      doshii.device.updateDevice(deviceId, data)
    ).resolves.toMatchObject(sampleUpdateDeviceResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data,
      method: "PUT",
      url: `/devices/${deviceId}`,
    });
  });

  test("Should requset for device removal", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: { message: "The requested device has been removed" },
    });
    const deviceId = "some0Booking5Id345";
    await expect(
      doshii.device.unregisterDevice(deviceId)
    ).resolves.toMatchObject({
      message: "The requested device has been removed",
    });
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
