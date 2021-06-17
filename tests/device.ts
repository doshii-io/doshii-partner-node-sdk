import Device from "../lib/device";

describe("Device", () => {
  let requestMaker: any;
  let device: Device;

  beforeEach(() => {
    jest.clearAllMocks();
    requestMaker = jest.fn().mockResolvedValue({ staus: 200 });
    device = new Device(requestMaker);
  });

  test("Should retrieve devices for a location", async () => {
    const deviceId = "some0Location5Id9";
    await expect(device.get()).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      method: "GET",
      url: "/devices",
    });
    await expect(device.get(deviceId)).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      method: "GET",
      url: `/devices/${deviceId}`,
    });
  });

  test("Should create a device", async () => {
    await expect(
      device.registerDevice({ device: "test device" })
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      data: { device: "test device" },
      method: "POST",
      url: `/devices`,
    });
  });

  test("Should update a device", async () => {
    const deviceId = "some0Booking5Id345";
    await expect(
      device.updateDevice(deviceId, { device: "update device" })
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      data: { device: "update device" },
      method: "PUT",
      url: `/devices/${deviceId}`,
    });
  });

  test("Should delete a device", async () => {
    const deviceId = "some0Booking5Id345";
    await expect(device.unregisterDevice(deviceId)).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      method: "DELETE",
      url: `/devices/${deviceId}`,
    });
  });
});
