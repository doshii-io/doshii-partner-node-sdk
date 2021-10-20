import Doshii, { TransactionRequest, TransactionUpdate } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";
import { sampleTransactionResponse } from "./sharedSamples";
jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Transaction", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
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
          value: 1000,
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
          value: 1000,
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
