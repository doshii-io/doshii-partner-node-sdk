import { AxiosRequestConfig, AxiosResponse } from "axios";

export default class Location {
  readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /**
  Retrieve all Locations associated with the App/Partner
  */
  async getAll() {
    return await this.requestMaker({ url: "/locations", method: "GET" });
  }

  async subscribeTo(locationID: string) {
    return await this.requestMaker({
      url: `/locations/${locationID}/subscription`,
      headers: {
        hashedLocationId: locationID,
      },
      method: "POST",
    });
  }

  async unSubscribeFrom(locationID: string) {
    return await this.requestMaker({
      url: `/locations/${locationID}/subscription`,
      headers: {
        hashedLocationId: locationID,
      },
      method: "DELETE",
    });
  }
}
