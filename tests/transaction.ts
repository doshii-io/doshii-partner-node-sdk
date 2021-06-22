import Doshii, { TransactionRequest, TransactionUpdate } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleTransactionResponse = {
  id: "124",
  orderId: "112",
  reference: "23ad34-45623f-768",
  invoice: "INV2245",
  method: "mastercard",
  amount: "1000",
  tip: 0,
  trn: "100412786589",
  acceptLess: false,
  partnerInitiated: true,
  prepaid: true,
  rejectionCode: "P1",
  rejectionReason: "Insufficient funds",
  version: "AJHBFjAKJFE3fnj33njj",
  surcount: [
    {
      posId: "123",
      name: "Item name",
      description: "Item description",
      amount: 1000,
      type: "absolute",
      value: "1000",
    },
  ],
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/transactions/124",
  status: "requested",
  linkedTrxId: "123",
  createdByApp: "123",
  processedByApp: "6",
  posTerminalId: "123",
  requestedAppId: "123",
};

const sampleTransactionLogsResponse = {
  logId: "f52e2b12-9b13-4113-bb49-3cfacad02545",
  employeeId: "1",
  employeeName: "Fred Bloggs",
  employeePosRef: "432324tgr",
  deviceRef: "213-iPad",
  deviceName: "Dining Room iPad 1",
  area: "Dining Room",
  appId: "12",
  appName: "Fred's Cool Ordering App",
  audit: "accepted => complete",
  action: [
    "Item ID (bd9e565a-affe-4f7d-9dc6-728151647af0) item_created",
    "order_updated",
  ],
  performedAt: "2019-01-01T12:00:00.000Z",
};

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for order transactions", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTransactionResponse] });
    await expect(
      doshii.transaction.getOrderTransactions(locationId, "someOrderId")
    ).resolves.toMatchObject([sampleTransactionResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders/someOrderId/transactions",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific transaction", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleTransactionResponse });
    const transactionId = "transactionI34";
    await expect(
      doshii.transaction.getTransaction(locationId, transactionId)
    ).resolves.toMatchObject(sampleTransactionResponse);
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
    const transactionId = "transactionI34";
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: [sampleTransactionLogsResponse],
    });
    await expect(
      doshii.transaction.getLogs(locationId, transactionId)
    ).resolves.toMatchObject([sampleTransactionLogsResponse]);
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

  test("Should request for a new transaction", async () => {
    const sampleCreateTransaction: TransactionRequest = {
      amount: 2500,
      reference: "123",
      invoice: "123",
      linkedTrxId: "123",
      method: "cash",
      tip: 500,
      trn: "100412786589",
      prepaid: true,
      surcounts: [
        {
          posId: "123",
          name: "Item name",
          description: "Item description",
          amount: 1000,
          type: "absolute",
          value: "1000",
        },
      ],
    };
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleTransactionResponse,
    });
    await expect(
      doshii.transaction.createTransaction(
        locationId,
        "someOrderId",
        sampleCreateTransaction
      )
    ).resolves.toMatchObject(sampleTransactionResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/someOrderId/transactions`,
      data: sampleCreateTransaction,
    });
  });

  test("Should request for a transaction update", async () => {
    const sampleUpdateTransaction: TransactionUpdate = {
      amount: 2500,
      version: "AJHBFjAKJFE3fnj33njj",
      status: "complete",
      reference: "123",
      invoice: "123",
      method: "cash",
      tip: 500,
      trn: "100412786589",
      prepaid: true,
      rejectionCode: "P1",
      rejectionReason: "Insufficient funds",
      surcounts: [
        {
          posId: "123",
          name: "Item name",
          description: "Item description",
          amount: 1000,
          type: "absolute",
          value: "1000",
        },
      ],
      verifyData: {
        requires: ["accountId"],
        accountId: "string",
        issueDate: "string",
        expiryDate: "string",
        authorisationCode: "string",
        imageUri: "string",
      },
    };
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleTransactionResponse,
    });
    const transactionId = "transactionI234";
    await expect(
      doshii.transaction.updateTransaction(
        locationId,
        transactionId,
        sampleUpdateTransaction
      )
    ).resolves.toMatchObject(sampleTransactionResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/transactions/${transactionId}`,
      data: sampleUpdateTransaction,
    });
  });
});
