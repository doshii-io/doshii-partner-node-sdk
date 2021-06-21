import { DoshiiEvents } from "./webhook";
import { AxiosRequestConfig } from "axios";

export interface DeviceRegister {
  name: string;
  ref: string;
  events: Array<DoshiiEvents>;
  terminals: Array<string>;
  channels: Array<
    | "Pay@Table"
    | "Order ahead"
    | "Reservations"
    | "Loyalty"
    | "PIP"
    | "MAR"
    | "Resources"
    | "GiftCards"
  >;
  locationIds: Array<string>;
}

export interface DeviceUpdate extends DeviceRegister {
  doshiiId: string;
  version: string;
}

export interface DeviceResponse extends DeviceRegister {
  doshiiId: string;
  version: string;
  updatedAt: string;
  createdAt: string;
}

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
  async get(
    deviceId?: string
  ): Promise<Array<DeviceResponse> | DeviceResponse> {
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
   * Retrieve all devices registered for your application
   * @returns a list of all devices
   */
  async getAll(): Promise<Array<DeviceResponse>> {
    return this.get() as Promise<Array<DeviceResponse>>;
  }

  /**
   * Retrieve all devices registered for your application
   * @param deviceId  The hashed ID of the registered device to retrieve.
   * @returns requested device details
   */
  async getOne(deviceId: string): Promise<DeviceResponse> {
    return this.get(deviceId) as Promise<DeviceResponse>;
  }

  /**
   * Register a device for your application
   * @returns the registered device
   *
   */
  async registerDevice(data: DeviceRegister): Promise<DeviceRegister> {
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
  async updateDevice(
    deviceId: string,
    data: DeviceUpdate
  ): Promise<DeviceUpdate> {
    return await this.requestMaker({
      url: `/devices/${deviceId}`,
      method: "PUT",
      data,
    });
  }

  /**
   * Unregister a device from your Doshii
   * @param deviceId The hashed ID of the registered device to delete
   * @returns success or failure message
   */
  async unregisterDevice(deviceId: string): Promise<{ message: string }> {
    return await this.requestMaker({
      url: `/devices/${deviceId}`,
      method: "DELETE",
    });
  }

  deleteDevice = this.unregisterDevice;
  removeDevice = this.unregisterDevice;
}
