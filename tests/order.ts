import Doshii from "../lib/doshii";
import { OrderStatus } from "../lib/order";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
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

  test("Should request for orders", async () => {
    await expect(doshii.order.get(locationId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders",
    });

    const orderId = "Order324";
    await expect(
      doshii.order.get(locationId, orderId, {
        to: new Date(),
        from: new Date(),
        status: [OrderStatus.ACCEPTED],
      })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}`,
    });
    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for orders with filters", async () => {
    await expect(
      doshii.order.get(locationId, "", {
        status: [OrderStatus.PENDING, OrderStatus.ACCEPTED],
        posRef: "pos234",
        externalOrderRef: "order234",
        posFrom: new Date("01-01-2021"),
        from: new Date("01-01-2021"),
        to: new Date("01-02-2021"),
        sort: "asc",
      })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders",
      params: {
        sort: "asc",
        posRef: "pos234",
        externalOrderRef: "order234",
        from: 1609419600,
        posFrom: 1609419600,
        status: [OrderStatus.PENDING, OrderStatus.ACCEPTED],
        to: 1609506000,
      },
    });
  });

  test("Should request for new order creation", async () => {
    const data = { order: "new order" };
    await expect(
      doshii.order.createOrder(locationId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders",
      data,
    });
  });

  test("Should request for order update", async () => {
    const data = { order: "order update" };
    const orderId = "order124";
    await expect(
      doshii.order.update(locationId, orderId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}`,
      data,
    });
  });

  test("Should request for order delivery update", async () => {
    const data = { order: "order delivery update" };
    const orderId = "order124";
    await expect(
      doshii.order.updateDelivery(locationId, orderId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/delivery`,
      data,
    });
  });

  test("Should request for order logs", async () => {
    const orderId = "order124";
    await expect(
      doshii.order.getLogs(locationId, orderId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/logs`,
    });
  });

  test("Should request to add items to an order", async () => {
    const orderId = "order124";
    const data = { items: "new items" };
    await expect(
      doshii.order.addItems(locationId, orderId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/items`,
      data,
    });
  });

  test("Should request to remove items from an order", async () => {
    const orderId = "order124";
    const data = { items: "remove items" };
    await expect(
      doshii.order.removeItems(locationId, orderId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "DELETE",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/items`,
      data,
    });
  });

  test("Should request to preprocess order", async () => {
    const data = { items: "remove items" };
    await expect(
      doshii.order.preprocess(locationId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/preprocess`,
      data,
    });
  });

  test("Should request to create transaction from an order", async () => {
    const data = { items: "remove items" };
    const orderId = "order234";
    await expect(
      doshii.order.createTransaction(locationId, orderId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/transactions`,
      data,
    });
  });

  test("Should request transactions for an order", async () => {
    const orderId = "order234";
    await expect(
      doshii.order.getTransactions(locationId, orderId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/transactions`,
    });
  });
});
