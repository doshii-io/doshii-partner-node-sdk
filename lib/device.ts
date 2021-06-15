import { AxiosRequestConfig } from "axios";

/**
 * Devices API
 */
export default class Device {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
   * Retrieve devices registered for your application
   * @param deviceId  The hashed ID of the registered device to retrieve. If not provided returns
   * all the registered devices
   * @returns a list of devices or just once device if deviceId id provided
   */
  async get(deviceId?: string) {
    let url = "/devices";
    if (deviceId) {
      url += `/${deviceId}`;
    }
    return await this.requestMaker({
      url,
      method: "GET",
    });
  }

  /**
   * Register a device for your application
   * @returns the registered device
   *
   */
  async registerDevice(data: any) {
    return await this.requestMaker({
      url: "/devices",
      method: "POST",
      data,
    });
  }

  /**
   * Update the details of a device registered to your application
   * @param deviceId The hashed ID of the registered device to update
   * @returns The updated device
   */
  async updateDevice(deviceId: string, data: any) {
    return await this.requestMaker({
      url: `/devices/${deviceId}`,
      method: "PUT",
      data,
    });
  }

  /**
   * Unregister a device from your Doshii
   * @param deviceId The hashed ID of the registered device to delete
   * @returns The deleted device
   */
  async unregisterDevice(deviceId: string) {
    return await this.requestMaker({
      url: `/devices/${deviceId}`,
      method: "DELETE",
    });
  }

  deleteDevice = this.unregisterDevice;
  removeDevice = this.unregisterDevice;
}
