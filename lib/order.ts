import { AxiosRequestConfig, AxiosResponse } from "axios";

export default class Orders {
  private orders = new Map<
    string,
    { resolve: (value: any) => void; reject: (reason?: any) => void }
  >();
  readonly requester: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requester: (data: AxiosRequestConfig) => Promise<any>) {
    this.requester = requester;
  }

  /*
  Create a new Order at a Location
  */
  async createOrder(locationId: string, data: any) {
    // send create order request to doshii
    const response = await this.requester({
      headers: {
        "doshii-location-id": locationId,
      },
      url: "/orders",
      method: "POST",
      data,
    });
    if (!response.data) {
      return response;
    }

    /*
    save to orders so that the status can be 
    updated when recieved from websocket
    which will resolve the returned promise
    */
    let resolveFunc: (value: any) => void;
    let rejectFunc: (reason?: any) => void;
    const result = new Promise((res, rej) => {
      resolveFunc = res;
      rejectFunc = rej;
    });
    this.orders.set(response.data.id, {
      resolve: resolveFunc!,
      reject: rejectFunc!,
    });
    return result;
  }

  orderUpdate(data: any) {
    const promiseFuncs = this.orders.has(data.id)
      ? this.orders.get(data.id)
      : undefined;
    if (promiseFuncs) {
      console.debug("Doshii: Got orderUpdate");
      promiseFuncs.resolve(data);
    }
  }
}
