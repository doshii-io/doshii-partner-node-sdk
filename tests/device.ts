import Doshii, { DoshiiEvents, DeviceRegister, DeviceUpdate } from "../lib";
import jwt from "jsonwebtoken";
import nock from "nock";
import _ from "lodash";

jest.mock("jsonwebtoken");

const sampleResponse = {
  doshiiId: "rj7DnGBL",
  name: "Device 1",
  ref: "24533-2345d-234f32-sdf21",
  events: ["order_created"],
  terminals: ["bEK3ryO7"],
  channels: ["Order ahead"],
  locationIds: ["4gJpXq9B"],
  version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
};

const sampleRegisterDeviceResponse = {
  name: "Device 1",
  ref: "24533-2345d-234f32-sdf21",
  events: ["order_created"],
  terminals: ["bEK3ryO7"],
  channels: ["Order ahead"],
  locationIds: ["4gJpXq9B"],
};

const sampleUpdateDeviceResponse = {
  doshiiId: "rj7DnGBL",
  name: "Device 1",
  ref: "24533-2345d-234f32-sdf21",
  events: ["order_created"],
  terminals: ["bEK3ryO7"],
  channels: ["Order ahead"],
  locationIds: ["4gJpXq9B"],
  version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
};

describe("Device", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  const deviceId = "some0Booking5Id345";
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
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

  test("Should request for all devices in a location", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get('/partner/v3/devices').reply(200, [sampleResponse]);

    await expect(doshii.device.getAll()).resolves.toMatchObject([
      sampleResponse,
    ]);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should request for a specific device in a location", async () => {
    const deviceId = "some0Location5Id9";
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/devices/${deviceId}`).reply(200, sampleResponse);

    await expect(doshii.device.getOne(deviceId)).resolves.toMatchObject(
      sampleResponse
    );

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should request for a new device registration", async () => {
    const data: DeviceRegister = {
      name: "test device",
      ref: "345klwejfskle",
      events: [DoshiiEvents.ORDER_CREATED],
      terminals: ["34rwerf"],
      channels: ["Pay@Table"],
      locationIds: ["2345ert"],
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).post(`/partner/v3/devices`, _.matches(data)).reply(200, sampleRegisterDeviceResponse);

    await expect(doshii.device.registerDevice(data)).resolves.toMatchObject(
      sampleRegisterDeviceResponse
    );
  });

  test("Should request for device update", async () => {
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

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).put(`/partner/v3/devices/${deviceId}`, _.matches(data)).reply(200, sampleUpdateDeviceResponse);

    await expect(
      doshii.device.updateDevice(deviceId, data)
    ).resolves.toMatchObject(sampleUpdateDeviceResponse);
  });

  test("Should requset for device removal", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).delete(`/partner/v3/devices/${deviceId}`).reply(200, { message: "The requested device has been removed" });

    await expect(
      doshii.device.unregisterDevice(deviceId)
    ).resolves.toMatchObject({
      message: "The requested device has been removed",
    });
  });

  test("Should reject the promise if request fails", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(() => true).reply(500);
    
    await expect(doshii.device.getAll()).rejects.toBeDefined();
    await expect(doshii.device.getOne(deviceId)).rejects.toBeDefined();
  });
});
