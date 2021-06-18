import Doshii from "../lib/doshii";
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

  test("Should request for order transactions", async () => {
    await expect(doshii.transaction.getOrderTransactions(locationId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/transactions",
    });

    const orderId = 'Order234'
    await expect(doshii.transaction.getOrderTransactions(locationId, orderId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/transactions/${orderId}`,
    });
    expect(authSpy).toBeCalledTimes(2)
  });

  test("Should request for a specific transaction", async () => {
    const transactionId = 'transactionI34'
    await expect(doshii.transaction.getTransaction(locationId, transactionId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/transactions/${transactionId}`,
    });
  });

  test("Should request for a specific transaction logs", async () => {
    const transactionId = 'transactionI34'
    await expect(doshii.transaction.getLogs(locationId, transactionId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/transactions/${transactionId}/logs`,
    });
  });

  test("Should request for a new order transaction", async () => {
    const orderId = 'Order34'
    const data = { transaction: 'new order transaction' }
    await expect(doshii.transaction.createOrderTransaction(locationId, orderId, data)).resolves.toBeDefined();
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

  test("Should request for a new transaction", async () => {
    const data = { transaction: 'new transaction' }
    await expect(doshii.transaction.createTransaction(locationId, data)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/transactions`,
      data,
    });
  });

  test("Should request for a transaction update", async () => {
    const transactionId = 'transactionI234'
    const data = { transaction: 'transaction update' }
    await expect(doshii.transaction.updateTransaction(locationId, transactionId, data)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/transactions/${transactionId}`,
      data,
    });
  });
});