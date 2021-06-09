import { AxiosRequestConfig, AxiosResponse } from "axios";

enum OrderStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
  Cancelled = "cancelled",
  Complete = "complete",
  VenueCancelled = "venue_cancelled",
}
export default class Order {
  // static readonly OrderStatus = _OrderStatus
  private orders = new Map<
    string,
    {
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      status: OrderStatus;
      details: any;
    }
  >();
  private readonly requestMaker: (data: AxiosRequestConfig) => Promise<any>;

  constructor(requestMaker: (data: AxiosRequestConfig) => Promise<any>) {
    this.requestMaker = requestMaker;
  }

  /*
  Create a new Order at a Location
  */
  async createOrder(locationId: string, data: any) {
    // send create order request to doshii
    const response = await this.requestMaker({
      headers: {
        "doshii-location-id": locationId,
      },
      url: "/orders",
      method: "POST",
      data,
    });

    console.log(response);
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
    this.orders.set(response.id, {
      resolve: resolveFunc!,
      reject: rejectFunc!,
      // status: Order.OrderStatus[response.data.status as string]
      status: response.status,
      details: response,
    });
    console.log(result);
    console.log(this.orders);
    return result;
  }

  orderUpdate(data: any) {
    // check if order id is present in orders
    const promiseControls = this.orders.has(data.id)
      ? this.orders.get(data.id)
      : undefined;

    if (promiseControls) {
      console.debug("Doshii: Got orderUpdate");
      console.debug(data);
      console.log(promiseControls);
      if (data.status == OrderStatus.Complete) {
        // resolve the promise if order is complete and
        // remove from oders cache
        promiseControls.resolve(data);
        this.orders.delete(data.id);
      } else if (
        [
          OrderStatus.Cancelled,
          OrderStatus.Rejected,
          OrderStatus.VenueCancelled,
        ].includes(data.status)
      ) {
        // Reject promise if order didnt go through
        // remove from oders cache
        promiseControls.reject(data);
        this.orders.delete(data.id);
      } else {
        // Update order status in cache
        promiseControls.status = data.status;
      }
    }
  }
}
