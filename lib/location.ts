import { AxiosRequestConfig, AxiosResponse } from "axios";

export default class Location {
  readonly requester: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requester: (data: AxiosRequestConfig) => Promise<any>) {
    this.requester = requester;
  }

  /**
  Retrieve all Locations associated with the App/Partner
  */
  async getAll() {
    return await this.requester({ url: "/locations", method: "GET" });
  }
}
